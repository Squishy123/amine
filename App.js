import React, { Component } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import Web from './Web';
import styles from './styles';

export default class App extends Component {
    render() {
        return (
            <View style={styles.row}>
                <View style={styles.col6}>
                <Text>Column 1</Text>
                    <Button
                        color='#42f4c5'
                        title="MasterAnime"
                        onPress={() => { Alert.alert("You Pressed Me!") }}
                    />
                    </View>
                     <View style={styles.col6}>
                     <Text>Column 2</Text>
                    <Button
                        color='#42f4c5'
                        title="MasterAnime"
                        onPress={() => { Alert.alert("You Pressed Me!") }}
                    />
                </View>
            </View>
        );
    }
}



