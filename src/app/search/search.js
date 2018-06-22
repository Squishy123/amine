import React from 'react';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: []
        }
        //bind functions
        this.buildSearchResults = this.buildSearchResults.bind(this);
    }

    buildSearchResults() {
        return fetch(`https://kitsu.io/api/edge/anime?filter[text]=${this.props.match.params.keyword}&page[limit]=12&page[offset]=0`)
        .then(res => res.json())
        .then((metadata) => {
            let results = [];
            for(let i = 0; i < metadata.data.length; i+=6) {
                let temp = [];
                    results.push((<div className="tile is-parent" style={{ padding: 0 }}>{temp}</div>));
                    metadata.data.slice(i, i + 6).forEach((e) => {
                        temp.push(
                            <div className="tile is-child is-2" style={{ padding: "10px" }}>
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
            this.setState({searchResults: results});
        })
    }

    componentDidMount() {
        //build search results
        this.buildSearchResults();
    }

    render() {
        return (
            <div className="container">
                <h1 className="title is-2 has-text-centered">Search Results</h1>
                <div className="tile is-ancestor is-vertical">{this.state.searchResults}</div>
            </div>
        )
    }
}