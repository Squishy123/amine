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

//metadata to build for ssr
import getTrending from './kitsu-api.js';

import registerServiceWorker from './registerServiceWorker';

getTrending().then(meta => {
    ReactDOM.render(
        <BrowserRouter>
            <App trendingAnime={meta} />
        </BrowserRouter>,
        document.getElementById('root'));
    registerServiceWorker();
})
