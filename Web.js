import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class Web extends Component {
    render() {
        return (
            <WebView
                source={{ uri: 'https://masterani.me' }}
                style={{ marginTop: 10 }}
            />
        );
    }
}