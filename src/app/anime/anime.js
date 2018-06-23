import React from 'react';

export default class Anime extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animeInfo: null,
            animePoster: null,
            episodes: [],
            player: null
        }

        this.buildAnimeMeta = this.buildAnimeMeta.bind(this);
        this.buildEpisodes = this.buildEpisodes.bind(this);
    }

    buildAnimeMeta() {
        return fetch(`https://kitsu.io/api/edge/anime/${this.props.match.params.id}`)
            .then(res => res.json())
            .then((metadata) => {
                let animePoster = (
                    <div>
                        <p className="title is-3">{metadata.data.attributes.canonicalTitle}</p>
                        <img width="45%" src={metadata.data.attributes.posterImage.large} />
                    </div>
                );
                this.setState({ animePoster: animePoster });
                let animeInfo = (
                    <div className="columns is-centered">
                        <div className="column is-3" style={{margin: "0 10px 0 10px"}}>
                            <div className="tile is-ancestor">
                                <div className="tile is-child has-text-centered">
                                    <div className="box">
                                        <h1 className="title is-4">Summary: </h1>
                                        <p className="subtitle is-5">{metadata.data.attributes.synopsis}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3" style={{margin: "0 10px 0 10px"}}>
                            <div className="tile is-ancestor is-vertical">
                                <div className="tile is-child has-text-centered">
                                    <div className="box">
                                        {animePoster}
                                    </div>
                                </div>
                                <div className="tile is-child has-text-centered">
                                    <div className="box">
                                        <h1 className="title is-5" style={{ margin: 5 }}>Anime Details</h1>
                                        <p className="subtitle is-6" style={{ margin: 6 }}>English: {metadata.data.attributes.titles["en"]}</p>
                                        <p className="subtitle is-6" style={{ margin: 6 }}>Japanese: {metadata.data.attributes.titles["ja_jp"]}</p>
                                        <p className="subtitle is-6" style={{ margin: 6 }}>Type: {metadata.data.attributes.showType}</p>
                                        <p className="subtitle is-6" style={{ margin: 6 }}>Episodes: {metadata.data.attributes.episodeCount}</p>
                                        <p className="subtitle is-6" style={{ margin: 6 }}>Aired: {metadata.data.attributes.startDate} to {metadata.data.attributes.endDate}</p>
                                        <p className="subtitle is-6" style={{ margin: 6 }}>Rating: {metadata.data.attributes.ageRating}-{metadata.data.attributes.ageRatingGuide}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                this.setState({ animeInfo: animeInfo });
            });
    }

    buildEpisodes() {
        //search database for anime episodes
        this.props.database.ref('scrape-results').once('value')
            .then(snapshot => snapshot.val()[this.props.match.params.keyword])
            .then((val) => {
                let episodes = [];
                if (val) {
                    Object.keys(val.episodes).forEach((key) => {
                        episodes.push(<div className="column"><button onClick={() => { this.buildPlayer(val.episodes[key].source) }} className="button is-dark">{key}</button></div>);
                    });
                    this.setState({ episodes: episodes });
                } else {
                    this.props.database.ref('scrape-requests').push(this.props.match.params.keyword);
                    this.props.database.ref(`scrape-results/${this.props.match.params.keyword}/episodes`).on('child_added', (snapshot) => {
                        console.log(snapshot.val())
                    })
                }
            })
    }

    buildPlayer(source) {
        let player = (
            <div style={{ position: "relative", padding: "56.25% 0 30px 0", height: 0, overflow: "hidden" }}>
                <iframe style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} src={source} sandbox="" allowfullscreen="true" />
            </div>
        )
        this.setState({ player: player });
    }

    componentDidMount() {
        this.buildAnimeMeta();
        this.buildEpisodes();
    }

    render() {
        return (
            <div>
                <section className="hero is-info">
                    <div className="hero-body">
                        <div className="columns is-centered">
                            <div className="column is-6 has-text-centered">
                                {this.state.player}
                            </div>
                        </div>
                        <div className="columns is-centered">
                            <div className="column is-6">
                                <div className="columns is-multiline is-mobile">
                                    {this.state.episodes}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="columns is-centered" style={{ margin: "10px 0 0 0" }}>
                    <div className="column">
                        {this.state.animeInfo}
                    </div>
                </div>
            </div>
        )
    }
}