import { render } from 'react-dom';
import App from './App';
import './App.css';
declare global {
  interface Window {
    electron?: any;
  }
}
render(<App />, document.getElementById('root'));
