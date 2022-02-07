import LCUConnector from 'lcu-connector';
import WebSocket from 'ws';
import axios, {Method} from 'axios';
import * as https from 'https';
import EventEmitter from 'events';

export default class LcuApi extends EventEmitter {
  private readonly connector;

  private ws: WebSocket | undefined | null;

  private connectionData:
    | {
    address: string;
    port: number;
    username: string;
    password: string;
    protocol: string;
  }
    | undefined;

  private static singleton: LcuApi | undefined;

  constructor() {
    super();
    if (!LcuApi.singleton) {
      LcuApi.singleton = this;
      this.connector = new LCUConnector();
      this.connector.on('connect', (data) => {
        console.log('Connect');
        this.connectionData = data;
        this.connectToWebSocket();
      });
      this.start();
    } else {
      throw new Error('Object already exists please use getSingleton()');
    }
  }

  public getConnector() {
    return this.connector;
  }

  public static getSingleton() {
    if (!this.singleton) {
      return new LcuApi();
    }
    return this.singleton;
  }

  private connectToWebSocket() {
    if (!this.connectionData) return;
    this.ws = new WebSocket(
      `wss://${this.connectionData.username}:${this.connectionData.password}@${this.connectionData.address}:${this.connectionData.port}/`,
      `wamp`,
      {
        rejectUnauthorized: false,
      }
    );

    this.ws.on('error', (error) => {
      console.log(`Error`);
      if (error.message.includes('ECONNREFUSED')) {
        this.destroyWebSocket();
        setTimeout(() => {
          this.connectToWebSocket();
        }, 1000);
      }
    });

    this.ws.on('message', (msg: string) => {
      let res;
      try {
        res = JSON.parse(msg);
      } catch (error) {
        console.log(error);
      }
      if (res[0] === 0) {
        this.emit(`api:connected`);
      }
      if (res[1] === 'OnJsonApiEvent') {
        const evt = res[2];
        this.emit(`${evt.uri}:${evt.eventType}`, evt.data);
        console.log(`${evt.uri}:${evt.eventType}`);
      }
    });

    this.ws.on('open', () => {
      this.ws!.send('[5, "OnJsonApiEvent"]');
    });
  }

  public async post(endpoint: string, body: any) {
    return this.handleRequest('POST', endpoint, body);
  }

  public async put(endpoint: string, body: any) {
    return this.handleRequest('PUT', endpoint, body);
  }

  public async get(endpoint: string, body?: any) {
    return this.handleRequest('GET', endpoint, body);
  }

  public async del(endpoint: string, body?: any) {
    return this.handleRequest('DELETE', endpoint, body);
  }

  private async handleRequest(method: Method, endpoint: string, body?: any) {
    if (!this.connectionData) return;
    const httpsAgent = new https.Agent({rejectUnauthorized: false});
    const url = `${this.connectionData.protocol}://${this.connectionData.address}:${this.connectionData.port}${endpoint}`;
    return (
      await axios({
        method,
        url,
        auth: {
          username: this.connectionData.username,
          password: this.connectionData.password,
        },
        data: body,
        httpsAgent,
      })
    ).data;
  }

  public destroyWebSocket() {
    this.ws!.removeAllListeners();
    this.ws = null;
  }

  private start() {
    this.connector.start();
  }
}
