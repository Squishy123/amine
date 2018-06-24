import React from 'react';
import styles from './footer.css';

export default class Footer extends React.Component {
    render() {
        return (<footer className="footer" id="footer">
            <div className="content has-text-centered" id="footer-content">
                <p>
                    <span style={{fontWeight: "bold"}}>Amine</span>@2018
                    FYI this site does not store any files on its server. All content is provided by non-affiliated third parties
                </p>
            </div>
        </footer>)
    }
}