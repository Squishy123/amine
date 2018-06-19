import React from 'react';
import ReactDOM from 'react-dom';

//router
import { BrowserRouter } from 'react-router-dom';

//bulma css
import 'bulma/css/bulma.css';

//styles
import styles from './index.css';

//main app file
import App from './app/app.js';

import registerServiceWorker from './registerServiceWorker';

    ReactDOM.render(
        <BrowserRouter>
            <App/>
        </BrowserRouter>,
        document.getElementById('root'));
    registerServiceWorker();
