import EventEmitter from "events";

export default class AirStorage extends EventEmitter {
  private static singleton: AirStorage | null = null;
  private data: any = {};

  constructor() {
    super();
  }

  public set(key: string, value: any) {
    this.data[key] = value;
    this.emit(`${key}:updated`, value);
    this.emit('data:updated',key);
  }

  public get(key: string) {
    return this.data[key];
  }

  public static getSingleton() {
    if (!this.singleton)
      this.singleton = new AirStorage();
    return this.singleton
  }
}
