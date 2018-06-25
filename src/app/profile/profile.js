import React from 'react';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        //database works!
        this.props.database.ref('9anime-search-results').once('value')
        .then((snapshot) => {
            console.log(snapshot.val());
        });
        //user works?
        if(this.props.user) {
            console.log(this.props.user.displayName);
        }
    }

    render() {
        return (
            <div>
                <h1 className="title">Profile</h1>
            </div>
        )
    }
}