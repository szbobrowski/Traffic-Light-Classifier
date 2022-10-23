import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useState } from 'react';

export default function TakePhoto() {
    const [type, setType] = useState(CameraType.front);

    const onStartCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            return (
                <View style={styles.mainContainer}>
                    <Camera  type={type}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.text}>Flip Camera</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        } else {
            Alert.alert('access denied!');
            return null;
        }
    }

    onStartCamera();
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      display: 'flex',
      backgroundColor: '#ececec',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      height: 250,
      width: '95%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
        fontSize: 30,
        color: '#1a2517',
        fontWeight: 'bold',
        textAlign: 'center',
    }
  });