import React from 'react';

//router
import {Route, Switch, withRouter} from 'react-router-dom';

//components
import SideMenu from './sidemenu/sideMenu.js';
import TopMenu from './topmenu/topMenu.js';
import Footer from './footer/footer.js';

//page components
import Home from './home/home.js';
import Profile from './profile/profile.js';
import Browse from './browse/browse.js';
import Anime from './anime/anime.js';
import Search from './search/search.js';

//styling
import styles from './app.css';

//firebase integration
import firebase, {auth, database, provider} from './firebase.js';

//google analytics integration
import Tracker from './ga-tracker.js';

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
                                    <Route exact path="/" component={Tracker(Home)}/>
                                    <Route exact path="/profile" component={Tracker(Profile, {user: this.state.user, database: database})}/>
                                    <Route exact path="/browse" component={Tracker(Browse)}/>
                                    <Route exact path="/search/:keyword" component={Tracker(Search)}/>
                                    <Route exact path="/animes/:id/:keyword" component={Tracker(withRouter(Anime), {user: this.state.user, database: database})}/>
                                    <Route exact path="/animes/:id/:keyword/episodes/:episode" component={Tracker(withRouter(Anime), {user: this.state.user, database: database})}/>
                            </main>
                            <Footer/>
                </div>
            </div>
        )
    }
}