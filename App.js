import React, { Component } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import Web from './Web';
import styles from './styles';

export default class App extends Component {
    render() {
        return (
            <View style={styles.screen}>
                <View>
                    <View style={styles.col12, styles.centerX}>
                        <Text style={styles.h1}>Amine</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col6}>
                        <Button
                            color='#42f4c5'
                            title="Button 1"
                            onPress={() => { Alert.alert("You Pressed Me!") }}
                        />
                    </View>
                    <View style={styles.col6}>
                        <Button
                            color='#42f4c5'
                            title="Button 2"
                            onPress={() => { Alert.alert("You Pressed Me!") }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}



