import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import Canvas from 'react-native-canvas';
import { drawRect } from '../utilities';
import * as ImageManipulator from 'expo-image-manipulator';

export default function TakePhoto({onChooseOption, getPredictions, realTime}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const canvasRef = useRef(null);

  const runRealTime = async () => {
    console.log("Start Real Time");
    setInterval(() => {
      takePicture();
    }, 1000);
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log("new photo taken", data);
      clearCanvas();

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        data.uri,
        [{ resize: { width: width, height: height } }],
        { compress: 0.8, format: "jpeg", base64: false }
      );
      console.log("Resized taken", resizedPhoto);
      
      setImage(resizedPhoto.uri);

      const predictions = await getPredictions(resizedPhoto.uri);
      handleCanvas(predictions, resizedPhoto.width, resizedPhoto.height);
    }
  }

  const handleCanvas = (predictions, imgWidth, imgHeight) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      console.log("W and H", width, height);
      drawRect(predictions, imgWidth, imgHeight, width, height, ctx);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0,0, width, height);
    }
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
    clearCanvas();

    if(realTime){
      runRealTime();
    }
  }, []);

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
     {!realTime && <Button title="Take picture" onPress={() => takePicture()} />}
     <Button title="Back to menu" onPress={() => onChooseOption('menu')} />
     <View 
      style={{flex: 1, position: 'relative'}}
      onLayout={({ nativeEvent }) => {
        const { _x, _y, width, height } = nativeEvent.layout;
        setWidth(Math.floor(width));
        setHeight(Math.floor(height));
      }}
     >
        {image && <Image source={{uri: image}} style={{position: 'absolute', width: width, height: height}}/>}
        <Canvas ref={canvasRef} width={width} height={height} style={{position: 'absolute'}}/>
     </View>
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
  },
  lightInfo: {
    height: 50,
    width: '100%',
  },
  message: {
    fontSize: 28,
    textAlign: 'center'
  },
});
