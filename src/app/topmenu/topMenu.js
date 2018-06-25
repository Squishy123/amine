import React, {render} from 'react';

import {Link} from 'react-router-dom';

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
            loginClick: true
        };

        //bind login and logout functions
        this.loginClick = this.loginClick.bind(this);
        this.search = this.search.bind(this);
    }

    search(e) {
        e.preventDefault();
        window.location = `/search/${document.querySelector('#searchQuery').value}`;
    }

    loginClick() {
        if(!this.state.loginClick) {
            document.querySelector('#loginVisible').classList.remove('is-active');
        } else {
            document.querySelector('#loginVisible').classList.add('is-active');
        }
        this.setState({loginClick: !this.state.loginClick});
    }

    render() {
        return (
        <div className = {[styles.main, "columns"]. join(' ')}>
            <div className="column is-6">
                <form autoComplete="off" onSubmit={this.search}>
                    <div className="field has-addons">
                        <div className="control is-expanded">
                            <input className="input is-medium" type="text" placeholder="Search" id="searchQuery"/>
                        </div>  
                        <div className="control">
                            <button type="submit" className="button is-info is-medium"><FontAwesomeIcon icon={faSearch}/></button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="user-panel columns has-text-right">
                <div className="column user-profile">
                    {this.props.user ?
                    <div className="dropdown is-right" id="loginVisible">
                        <div className="dropdown-trigger">
                            <button className="profile-button" onClick={this.loginClick} aria-haspopup="true" aria-controls="dropdown-menu">
                                <img className="user-photo-url"src={this.props.user.photoURL} />
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                            <div className="dropdown-content has-text-centered">
                                <div className="dropdown-item">
                                    <p className="subtitle is-3">{this.props.user.displayName}</p>
                                </div>
                                <div className="dropdown-item">
                                    <Link className="button is-info" to="/profile">My Account</Link>
                                </div>
                                <div className="dropdown-item">
                                    <a className="button is-info" onClick={this.props.logout}>Sign out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <a className="button is-info is-medium" onClick={this.props.login}>Sign in</a>}
                </div>
            </div>
        </div>
        )
    }

}