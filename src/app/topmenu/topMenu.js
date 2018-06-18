import React from 'react';

//fontawesome
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/fontawesome-free-solid';

//style
import styles from './topMenu.css';

export default class TopMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className = {[styles.main, "columns is-centered"]. join(' ')}>
            <div className="column is-9 is-paddingless">
                <div className="field has-addons">
                    <div class="control is-expanded">
                        <input class="input is-medium" type="text" placeholder="Search"/>
                    </div>  
                    <div class="control">
                        <a class="button is-info is-medium"><FontAwesomeIcon icon={faSearch}/></a>
                    </div>
                </div>
            </div>
        </div>
        )
    }

}