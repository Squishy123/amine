import fetch from 'isomorphic-fetch';

export default function getTrending() {
    return fetch(`https://kitsu.io/api/edge/trending/anime`).then(res =>res.json());
}