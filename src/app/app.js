import React from 'react';

//router
import {Route} from 'react-router-dom';

//components
import SideMenu from './sidemenu/sideMenu.js';
import TopMenu from './topmenu/topMenu.js';

//page components
import Home from './home/home.js';
import Browse from './browse/browse.js';

//styling
import styles from './app.css';

//firebase integration
import firebase, {auth, provider} from './firebase.js';

export default class App extends React.Component {
    constructor(props) {
        super();
        this.state = {
            user: null
        }

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login() {
        auth.signInWithPopup(provider).then((result) => {
            const user = result.user;
            console.log(user);
            this.setState({user})
        })
    }

    logout() {
        auth.signOut().then(() => {
            this.setState({user: null})
        })
    }

    componentDidMount() {
        //check if user was signed in last time and login if yes
        auth.onAuthStateChanged((user) => {
            if(user) {
                this.setState({user})
            }
        })
    }

    render() {
    return (
        <div className="App">
            <div id="outer-container">
                <SideMenu/>
                <TopMenu login={this.login} logout={this.logout} user={this.state.user}/>
                <main id="page-wrap">
                    <Route exact path="/" render={()=>(<Home/>)}/>
                    <Route exact path="/browse" component={()=>(<Browse trendingAnime={this.props.trendingAnime}/>)}/>
                </main>
            </div>
        </div>
    )
}
}