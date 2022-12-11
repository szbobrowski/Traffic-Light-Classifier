import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function TakePhoto({onChooseOption, getPredictions}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [result, setResult] = useState(<Text style={styles.message}></Text>);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      setResult(<Text style={styles.message}>waiting for results</Text>);
      const predictions = await getPredictions(data.uri);
      // console.log('predictions from takePhoto', predictions);
      // const position = getPositionOfHighestValue(predictions[0]);
      const position = 0
      switch (position) {
        case 0:
          setResult(<Text style={styles.message}>no lights detected</Text>);
          break;
        case 1:
          setResult(<Text style={[styles.message, styles.green]}>green</Text>);
          break;
        case 2:
          setResult(<Text style={[styles.message, styles.red]}>red</Text>);
          break;
        case 3:
          setResult(<Text style={[styles.message, styles.orange]}>orange</Text>);
          break;
      }
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
     <View style={styles.lightInfo}>
        {result}
     </View>
    </View>
  );
}

function getPositionOfHighestValue(valuesArray) {
  if (valuesArray[0] > valuesArray[1] && valuesArray[0] > valuesArray[2] && valuesArray[0] > valuesArray[3]) {
    return 0;
  } else if (valuesArray[1] > valuesArray[0] && valuesArray[1] > valuesArray[2] && valuesArray[1] > valuesArray[3]) {
    return 1;
  } else if (valuesArray[2] > valuesArray[0] && valuesArray[2] > valuesArray[1] && valuesArray[2] > valuesArray[3]) {
    return 2;
  } else {
    return 3;
  }
} 

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio:{
      height: 320,
      width: '100%'
  },
  lightInfo: {
    height: 50,
    width: '100%',
  },
  message: {
    fontSize: 28,
    textAlign: 'center'
  },
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
  orange: {
    color: 'orange'
  }
});
