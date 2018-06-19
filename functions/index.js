import * as functions from 'firebase-functions';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/app/app.js';
import getTrending from '../src/kitsu-api.js';
import * as express from 'express';

const app = express();
app.get('**', (req, res) => {
    getTrending().then(meta => {
        const html = renderToString(
            <BrowserRouter>
                <App trendingAnime={meta} />
            </BrowserRouter>);
        res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
        res.send(html);
    })
})

export let ssrapp = functions.https.onRequest(app);