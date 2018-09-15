import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Anime extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animeInfo: null,
            animePoster: null,
            episodes: <div className="column is-12 has-text-centered"><h1 className="title is-2">Querying Server...</h1><button className="button is-large is-primary is-loading">Request</button></div>,
            episodeSources: [],
            player: null,
            native: false,
            metadata: null
        }

        this.buildAnimeMeta = this.buildAnimeMeta.bind(this);
        this.buildEpisodes = this.buildEpisodes.bind(this);
        this.requestEpisodes = this.requestEpisodes.bind(this);
        this.buildPlayer = this.buildPlayer.bind(this);
        this.buildBetaPlayer = this.buildBetaPlayer.bind(this);
        this.buildTrailer = this.buildTrailer.bind(this);
    }

    buildAnimeMeta() {
        return fetch(`https://kitsu.io/api/edge/anime/${this.props.match.params.id}`)
            .then(res => res.json())
            .then((metadata) => {
                //save meta
                this.setState({ metadata: metadata });

                let animePoster = (
                    <div>
                        <p className="title is-3">{metadata.data.attributes.canonicalTitle}</p>
                        <img width="45%" src={metadata.data.attributes.posterImage.large} />
                    </div>
                );
                this.setState({ animePoster: animePoster });
                let animeInfo = (
                    <div className="columns is-centered">
                        <div className="column is-6" style={{ margin: "0 10px 0 10px" }}>
                            <div className="tile is-ancestor">
                                <div className="tile is-child has-text-centered">
                                    <div className="box">
                                        <h1 className="title is-4">Summary: </h1>
                                        <p className="subtitle is-5">{metadata.data.attributes.synopsis}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3" style={{ margin: "0 10px 0 10px" }}>
                            <div className="tile is-ancestor is-vertical">
                                <div className="tile is-child has-text-centered">
                                    <div className="box">
                                        {animePoster}
                                    </div>
                                </div>
                                <div className="tile is-child has-text-centered">
                                    <div className="box">
                                        <button className="button is-dark" onClick={() => { this.buildTrailer(`https://www.youtube.com/embed/${metadata.data.attributes.youtubeVideoId}`) }}>Watch Trailer</button>
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
        this.props.database.ref(`scrape-results/${this.props.match.params.keyword}`).once('value')
            .then(snapshot => snapshot.val())
            .then((val) => {
                if (!val) {
                    this.setState({
                        episodes:
                            <div className="column has-text-centered">
                                <p className="title is-2">No animes stored in database</p>
                                <button className="button is-large is-primary" onClick={() => { this.setState({ episodes: <div className="column is-12 has-text-centered"><h1 className="title is-2">Scraping...</h1><button className="button is-large is-primary is-loading">Request</button></div> }); this.requestEpisodes() }}>Request Episodes</button>
                            </div>
                    })
                } else {
                    this.props.database.ref(`scrape-results/${this.props.match.params.keyword}`).once('value')
                        .then(snapshot => snapshot.val())
                        .then((val) => {
                            let episodes = [];
                            let length = 0;
                            let episodeSources = val.episodes;

                            Object.keys(val.episodes).forEach((key) => {
                                if (Number(key)) {
                                    length++;
                                }
                                let src = episodeSources[key][0].src;
                                //console.log(src);
                                episodes.push(<div className="column"><button onClick={() => { this.redirectEpisodeLink(key); this.buildPlayer(src, key) }} className={`button ${(key == this.props.match.params.episode) ? "is-danger" : "is-dark"}`}>{key}</button></div>);
                            });
                            this.setState({ episodes: episodes, episodeSources: episodeSources });

                            //check if episodeNumber
                            if (this.props.match.params.episode) {
                                if (episodeSources[this.props.match.params.episode]) {
                                    this.buildPlayer(null, this.props.match.params.episode);
                                }
                            } else if (episodeSources["1"] && !this.props.match.params.episode) {
                                this.redirectEpisodeLink("1");
                                this.buildPlayer(episodeSources["1"].source, 1);
                            }

                            //check if episodes are at max length
                            if (episodes && this.state.metadata && length < this.state.metadata.data.attributes.episodeCount) {
                                //add request button
                                episodes.push(<div className="column is-12 has-text-centered">
                                    <p className="title is-2">Check for Updates</p>
                                    <button className="button is-large is-primary" onClick={() => { let eps = this.state.episodes; eps.pop(); this.setState({ episodes: eps }); this.requestEpisodes() }}>Request Update</button>
                                </div>)
                                //set state
                                this.setState({ episodes: episodes, episodeSources: episodeSources });
                            }
                        });
                }
            });
    }

    requestEpisodes() {
        this.setState({ episodes: <div className="column is-12 has-text-centered"><h1 className="title is-2">Scraping...</h1><button className="button is-large is-primary is-loading">Request</button></div> })
        this.props.database.ref('scrape-requests').push(this.props.match.params.keyword);
        //add listener 
        let listener = this.props.database.ref(`scrape-results/${this.props.match.params.keyword}/episodes`).on('child_added', (snapshot) => {
            this.props.database.ref(`scrape-results/${this.props.match.params.keyword}`).once('value')
                .then(snapshot => snapshot.val())
                .then((val) => {
                    let episodes = [];

                    let episodeSources = val.episodes;

                    Object.keys(val.episodes).forEach((key) => {
                        episodes.push(<div className="column"><button onClick={() => { this.redirectEpisodeLink(key); this.buildPlayer(val.episodes[key][0].src, key) }} className={`button ${(key == this.props.match.params.episode) ? "is-danger" : "is-dark"}`}>{key}</button></div>);
                    });

                    //push requesting button
                    episodes.push(<div className="column is-12 has-text-centered"><h1 className="title is-2">Scraping...</h1><button className="button is-large is-primary is-loading">Request</button></div>);


                    this.setState({ episodes: episodes, episodeSources: episodeSources });

                    //check if episodeNumber
                    if (this.props.match.params.episode && !this.state.player) {
                        if (episodeSources[this.props.match.params.episode]) {
                            console.log("drawing!");
                            this.buildPlayer(episodeSources[this.props.match.params.episode].source, this.props.match.params.episode);
                        }
                    } else if (episodeSources["1"] && !this.props.match.params.episode) {
                        this.redirectEpisodeLink("1");
                        this.buildPlayer(episodeSources["1"].source, 1);
                    }

                    //check if episodes are at max length
                    if (episodes && this.state.metadata && episodes.length - 1 >= this.state.metadata.data.attributes.episodeCount) {
                        //remove request button
                        episodes.pop();
                        this.setState({ episodes: episodes });
                        this.props.database.ref(`scrape-results/${this.props.match.params.keyword}/episodes`).off('child_added', listener);
                    }
                });
        });
    }

    buildTrailer(source) {
        let player = (
            <div style={{ position: "relative", padding: "56.25% 0 30px 0", height: 0, overflow: "hidden" }}>
                <iframe style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} src={source} allowFullScreen={true} />
            </div>
        )
        this.setState({ player: player });
    }

    buildPlayer(source, id) {
        this.setState({ player: null }, () => {
            let player = (
                <div>
                    <div style={{ position: "relative", padding: "56.25% 0 30px 0", height: 0, overflow: "hidden" }}>
                        <iframe style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} src={this.state.episodeSources[id][0].src} sandbox={`${(this.state.native) ? " " : "allow-scripts"} allow-same-origin`} allow="autoplay; fullscreen" allowFullScreen={true} frameBorder="no" scrolling="no" />
                    </div>
                </div>
            )
            /*     various player buttons rollback
                  <div className="columns">
                        <div className="column">
                            <button className="button is-danger" style={{ marginTop: "15px" }} onClick={() => { this.setState({ native: false }); this.buildPlayer(null, id); }}>Regular Player</button>
                        </div>
                    </div>              
                        <div className="column">
                            <button className="button is-danger" style={{ marginTop: "15px" }} onClick={() => { this.setState({ native: true }); this.buildPlayer(source, id); }}>Native Player</button>
                        </div>
                        <div className="column">
                            <button className="button is-danger" style={{ marginTop: "15px" }} onClick={() => { this.buildBetaPlayer(source, id) }}>Beta Player</button>
                        </div>*/
            this.setState({ player: player });
        })

    }

    buildBetaPlayer(source, id) {
        this.setState({ player: null })
        let xhr = new XMLHttpRequest();
        let obj = this;
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let html = this.responseText;
                let vdom = document.createRange().createContextualFragment(html);
                let qualityList = [];
                vdom.querySelectorAll('#home_video > div:nth-child(8) > a').forEach((e) => {
                    let q = (
                        <div className="column">
                            <button className="button is-link" onClick={() => { obj.buildBetaPlayer(e.href, id) }}>{e.querySelector('div').innerHTML}</button>
                        </div>
                    );
                    qualityList.push(q);
                })
                let src = vdom.querySelector('source').src;
                let name = `${obj.props.match.params.keyword} Episode: ${id}`;
                console.log(name);
                let player = (
                    <div>
                        <div style={{ position: "relative", padding: "56.25% 0 30px 0", height: 0, overflow: "hidden" }}>
                            <video style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} controls autoPlay>
                                <source src={src} type="video/mp4" />
                                You're browser does not support this player...
                        </video>
                        </div>
                        <div className="columns" style={{ marginTop: "15px" }}>
                            {qualityList}
                        </div>
                        <a className="button is-link" download={name} href={src} >Download Episode</a>
                    </div>
                )
                obj.setState({ player: player });
            }
        }
        let url = `${window.location.href.includes('localhost') ? `https://192.168.2.64:2000` : `https://70.48.23.75:2000`}` + `/${source}`;
        xhr.open("POST", url); // assuming you’re hosting it locally
        xhr.setRequestHeader("Content-type", 'application/html');
        let data = {
            headers: {
                Accept: "application/html",
                Origin: "https://www.rapidvideo.com"
            },
            method: 'GET'
        };
        xhr.send(JSON.stringify(data))
    }

    redirectEpisodeLink(episodeName) {
        this.props.history.push(`/animes/${this.props.match.params.id}/${this.props.match.params.keyword}/episodes/${episodeName}`);
    }

    componentDidMount() {
        this.buildAnimeMeta();
        this.buildEpisodes();
    }

    render() {
        return (
            <div>
                <section className="hero is-info is-bold">
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
                <div className="columns is-centered" style={{ margin: "15px 0 40px 0" }}>
                    <div className="column">
                        {this.state.animeInfo}
                    </div>
                </div>
            </div >
        )
    }
}