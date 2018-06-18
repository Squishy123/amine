import React, {render} from 'react';

//fontawesome
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/fontawesome-free-solid';

//style
import styles from './topMenu.css';

//firebase integration
import firebase, {auth, provider} from '../firebase.js';

export default class TopMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loginClick: true
        };

        //bind login and logout functions
        this.loginClick = this.loginClick.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);

    }

    loginClick() {
        if(!this.state.loginClick) {
            document.querySelector('#loginVisible').classList.remove('is-active');
        } else {
            document.querySelector('#loginVisible').classList.add('is-active');
        }
        this.setState({loginClick: !this.state.loginClick});
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
        <div className = {[styles.main, "columns is-centered"]. join(' ')}>
            <div className="column is-9">
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input className="input is-medium" type="text" placeholder="Search"/>
                    </div>  
                    <div className="control">
                        <a className="button is-info is-medium"><FontAwesomeIcon icon={faSearch}/></a>
                    </div>
                </div>
            </div>
            <div className="column is-3 columns has-text-right">
                <div className="column user-profile">
                    {this.state.user ?
                    <div className="dropdown is-right" id="loginVisible">
                        <div class="dropdown-trigger">
                            <button className="profile-button" onClick={this.loginClick} aria-haspopup="true" aria-controls="dropdown-menu">
                                <img className="user-photo-url"src={this.state.user.photoURL} />
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content has-text-centered">
                                <div class="dropdown-item">
                                    <p className="subtitle is-3">{this.state.user.displayName}</p>
                                </div>
                                <div class="dropdown-item">
                                    <a className="button is-info">My Account</a>
                                </div>
                                <div class="dropdown-item">
                                    <a className="button is-info" onClick={this.logout}>Sign out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <a className="button is-info" onClick={this.login}>Sign in</a>}
                </div>
            </div>
        </div>
        )
    }

}