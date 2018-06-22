import React from 'react';
import styles from './footer.css';

export default class Footer extends React.Component {
    render() {
        return (<footer className="footer" id="footer">
            <div className="content has-text-centered" id="footer-content">
                <p>
                    <span style={{fontWeight: "bold"}}>Amine</span> 2018 created by <a href="https://github.com/Squishy123">Christian Wang</a> 
                </p>
            </div>
        </footer>)
    }
}