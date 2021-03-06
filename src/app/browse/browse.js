import React from 'react';

export default class Browse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trendingAnime: []
        }

        //bind functions
        this.buildTrendingAnime = this.buildTrendingAnime.bind(this);
    }

    buildTrendingAnime() {
        return fetch(`https://kitsu.io/api/edge/trending/anime`)
            .then(res => res.json())
            .then((metadata) => {
                let trendingList = [];
                for (let i = 0; i < metadata.data.length; i += 4) {
                    let temp = [];
                    trendingList.push((<div className="tile is-parent" style={{ padding: 0 }}>{temp}</div>));
                    metadata.data.slice(i, i + 4).forEach((e) => {
                        temp.push(
                            <div className="tile is-child is-3" style={{ padding: "10px" }}>
                                <div className="card">
                                    <div className="card-header" style={{ height: "100px" }}>
                                        <div className="card-header-title">
                                            <p className="title is-5">{e.attributes.canonicalTitle}</p>
                                        </div>
                                    </div>
                                    <div className="card-image">
                                        <img src={e.attributes.posterImage.large} />
                                    </div>
                                    <div className="card-content has-text-centered">
                                        <a className="button is-info" href={`/animes/${e.id}/${e.attributes.canonicalTitle}`} >
                                            Watch Now
                                    </a>
                                    </div>
                                </div>
                            </div>)
                    });
                }
                this.setState({ trendingAnime: trendingList });
            })
    }

    componentDidMount() {
        //build trending anime list
        this.buildTrendingAnime();
    }

    render() {
        return (
            <div>
                <div className="hero is-light is-bold">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title is-2 has-text-centered">Trending Anime</h1>
                            <div className="tile is-ancestor is-vertical">{this.state.trendingAnime}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}