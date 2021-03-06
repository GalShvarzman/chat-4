import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {store} from './state/store';
import {loadGroups, loadUsers} from "./state/actions";
import {Provider} from "react-redux";

store.dispatch(loadUsers());
store.dispatch(loadGroups());

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
                <App />
        </BrowserRouter>
    </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
