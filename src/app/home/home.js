import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="has-text-centered">
                <h1 className="title is-1">Amine</h1>
                <p className="subtitle is-3">Now in beta!</p>
                <img  src="assets/logo.svg" width="300px"></img>
            </div>
        )
    }
}