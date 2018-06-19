import React from 'react';

export default class Browse extends React.Component {
    constructor(props) {
        super(props);

        console.log(props.trendingAnime);
    }
    render() {
        return (
            <h1 className="title">Welcome to Browse!</h1>
        )
    }
}