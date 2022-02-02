import {render} from 'react-dom';
import App from './App';
import './App.css';

declare global {
  interface Window {
    electron?: any;
    storage: {
      get: (key: string) => any;
      set: (key: string, val: any) => void;
      on: (key: string, func: Function) => void;
      removeListeners:(key:string) => void;
    }
  }
}
render(<App/>, document.getElementById('root'));
