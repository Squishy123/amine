import React from 'react';

import SideMenu from './app/sidemenu/sideMenu.js';
import TopMenu from './app/topmenu/topMenu.js';

import styles from './app.css';

export default function App() {
    return (
        <div id="outer-container">
            <SideMenu/>
            <TopMenu/>
            <main id="page-wrap">
                <h1 className="title">Hello World</h1>
            </main>
        </div>
    )
}