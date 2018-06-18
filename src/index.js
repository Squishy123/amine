import React from 'react';
import ReactDOM from 'react-dom';

//router
import {BrowserRouter} from 'react-router-dom';

//bulma css
import 'bulma/css/bulma.css';

import styles from './index.css';
import App from './app';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
<BrowserRouter>
    <App />
</BrowserRouter>, 
document.getElementById('root'));
registerServiceWorker();
