import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function TakePhoto({onChooseOption, getPredictions}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      // console.log('data', data)
      // console.log('data uri', data.uri);
      setImage(data.uri);
      getPredictions(data.uri);
    }
  }

  if (hasCameraPermission === false) {
    return <Text>No Camera Access</Text>
  }

  return (
    <View style={{ flex: 1}}>
      <View style={styles.camera}>
        <Camera ref={ref => setCamera(ref)} style={styles.fixedRatio} type={type} ratio={'1020:1980'} />
      </View>
      <Button
            title="Flip Image"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
     </Button>
     <Button title="Take picture" onPress={() => takePicture()} />
     <Button title="Back to menu" onPress={() => onChooseOption('menu')} />
     {image && <Image source={{uri: image}} style={{flex:1}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio:{
      height: 320,
      width: '100%'
  }
});
