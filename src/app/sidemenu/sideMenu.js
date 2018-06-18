import React from 'react';

//router
import {Link} from "react-router-dom";

//hamburger menu
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
                 <Link className="menu-item logo" to="/">
                    <span style={{fontSize: "30px"}}><span style={{fontWeight: "bold"}}>A</span>mine</span>
                </Link>
                <Link className="menu-item" to="/browse">
                    <FontAwesomeIcon icon={faSlidersH}/> Browse
                </Link>
                <Link className="menu-item" to="/">
                    <FontAwesomeIcon icon={faCalendarAlt}/> Schedule
                </Link>
                <Link className="menu-item" to="/">
                        <FontAwesomeIcon icon={faCog}/> Settings
                </Link>
                <div className="menu-item" id="bot">
                    <h3>
                        Version: Katsu
                    </h3>
                </div>
            </Menu>
        )
    }
}