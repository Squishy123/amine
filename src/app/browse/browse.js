import React from 'react';

export default class Browse extends React.Component {
    constructor(props) {
        super(props);

        console.log(props.trendingAnime);
    }
    render() {
        let mediaList = [];
        for (let i = 0; i < this.props.trendingAnime.data.length; i+=6) {
            let temp = [];
            mediaList.push((<div className="tile is-parent" style={{ padding: 0 }}>{temp}</div>));
            this.props.trendingAnime.data.slice(i, i + 6).forEach((e) => {
                temp.push(
                    <div className="tile is-child is-2"  style={{ padding: "10px" }}>
                        <div className="card" style={{ height: "100%" }}>
                            <div className="card-header" style={{ height: "100px" }}>
                                <div className="card-header-title">
                                    <p className="title is-5">{e.attributes.canonicalTitle}</p>
                                </div>
                            </div>
                            <div className="card-image">
                                <img src={e.attributes.posterImage.large} />
                            </div>
                            <div className="card-content">
                                <a className="button is-primary" href={`/animes/${e.id}/${e.attributes.canonicalTitle}`} >
                                    Watch Now
                                </a>
                            </div>
                        </div>
                    </div>)
            });
        }

        return (
            <div>
                <h1 className="title">Browse</h1>
                <div className="tile is-ancestor is-vertical" style={{padding: "20px"}}>{mediaList}</div>
            </div>
        )
    }
}