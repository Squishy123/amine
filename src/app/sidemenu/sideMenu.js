import React from 'react';

import { elastic as Menu } from 'react-burger-menu';

//fontawesome
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faCog, faCalendarAlt, faSlidersH } from '@fortawesome/fontawesome-free-solid';

//style
import styles from './sideMenu.css';

export default class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
                 <a className="menu-item logo" href="/">
                    <span style={{fontSize: "30px"}}><span style={{fontWeight: "bold"}}>A</span>mine</span>
                </a>
                <a className="menu-item" href="/">
                    <FontAwesomeIcon icon={faSlidersH}/> Browse
                </a>
                <a className="menu-item" href="/">
                    <FontAwesomeIcon icon={faCalendarAlt}/> Schedule
                </a>
                <a className="menu-item" href="/">
                        <FontAwesomeIcon icon={faCog}/> Settings
                </a>
                <div className="menu-item" id="bot">
                    <h3>
                        Version: Katsu
                    </h3>
                </div>
            </Menu>
        )
    }
}