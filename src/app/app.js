import React from 'react';

//router
import {Route} from 'react-router-dom';

//components
import SideMenu from './sidemenu/sideMenu.js';
import TopMenu from './topmenu/topMenu.js';

//pages
import Home from './home/home.js';
import Browse from './browse/browse.js';

//styling
import styles from './app.css';

export default class App extends React.Component {
    constructor() {
        super();
    }

    render() {
    return (
        <div className="App">
            <div id="outer-container">
                <SideMenu/>
                <TopMenu/>
                <main id="page-wrap">
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/browse" component={Browse}/>
                </main>
            </div>
        </div>
    )
}
}