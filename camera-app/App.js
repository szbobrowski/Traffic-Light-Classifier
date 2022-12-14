import React, {useEffect, useState} from 'react';
import Menu from './components/Menu';
import TakePhoto from './components/TakePhoto'
import * as tf from '@tensorflow/tfjs'
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
import * as FileSystem from 'expo-file-system';
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as imageManipulator from 'expo-image-manipulator';
import { Text, View } from 'react-native';

export default function App() {
  const [option, setOption] = useState('menu');
  const [model, setModel] = useState(null);
  const [detector, setDetector] = useState(null);

  const loadModel = async () => {
    const modelJSON = require('./models/model.json')
    const modelWeights1 = require('./models/group1-shard1of2.bin')
    const modelWeights2 = require('./models/group1-shard2of2.bin')

    await tf.ready();

    const model = await tf.loadGraphModel(
        bundleResourceIO(modelJSON, [
          modelWeights1,
          modelWeights2
        ])
    ).catch((e) => {
      console.log("[LOADING ERROR] info:", e);
    })
    
    setModel(model);
    console.log('model loaded');

    const detector = await cocossd.load({base: 'mobilenet_v2'});
    setDetector(detector);
    console.log('detector loaded');
  }

  const transformImageToTensor = async (uri) => {
      const img64 = await FileSystem.readAsStringAsync(uri, {encoding:FileSystem.EncodingType.Base64})
      const imgBuffer =  tf.util.encodeString(img64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      let imgTensor = decodeJpeg(raw);

      imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [48, 48])
      const img = tf.reshape(imgTensor, [1,48,48,3])

      return img.toFloat();
  }

  const transformMainImageToTensor = async (uri) => {
    const img64 = await FileSystem.readAsStringAsync(uri, {encoding:FileSystem.EncodingType.Base64})
    const imgBuffer =  tf.util.encodeString(img64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
    let imgTensor = decodeJpeg(raw);

    return imgTensor;
  }

  const makePredictions = async ( batch, model, imagesTensor ) => {
    const predictionsdata = model.predict(imagesTensor).arraySync();
     
    return predictionsdata;
  }

  const detect = async ( model, imagesTensor ) => {
    const detectiondata = model.detect(imagesTensor);
     
    return detectiondata;
  }

  const getClassAndScoreFromClassifications = (valuesArray) => {
    if (valuesArray[0] > valuesArray[1] && valuesArray[0] > valuesArray[2] && valuesArray[0] > valuesArray[3]) {
      return ['unknown', valuesArray[0]];
    } else if (valuesArray[1] > valuesArray[0] && valuesArray[1] > valuesArray[2] && valuesArray[1] > valuesArray[3]) {
      return ['green', valuesArray[1]];
    } else if (valuesArray[2] > valuesArray[0] && valuesArray[2] > valuesArray[1] && valuesArray[2] > valuesArray[3]) {
      return ['red', valuesArray[2]];
    } else {
      return ['yellow', valuesArray[3]];
    }
  }

  const getPredictions = async (image) => {
    await tf.ready();

    console.log('img', image);

    console.log(1);
    const tensorImage = await transformMainImageToTensor(image);
    console.log(2);
    const detections = await detect(detector, tensorImage);


    console.log('detections before', detections);

    const predictions = await Promise.all(detections.filter(detection => detection.class === 'traffic light').map(async trafficLight => {
      console.log(trafficLight);

      // trafficLight.bbox[0] = trafficLight.bbox[0]-20;
      // trafficLight.bbox[1] = trafficLight.bbox[1]-20;
      // trafficLight.bbox[2] = trafficLight.bbox[2]+40;
      // trafficLight.bbox[3] = trafficLight.bbox[3]+40;

      const cropData = {
        originX: trafficLight.bbox[0], 
        originY: trafficLight.bbox[1], 
        width: trafficLight.bbox[2],
        height: trafficLight.bbox[3]
      }
      console.log('image', image)

      await imageManipulator.manipulateAsync(image, [{crop: cropData}]).then(async result => {
        const tensorImage2 = await transformImageToTensor(result.uri);
        const classifications = await makePredictions(1, model, tensorImage2);
        const [classification_class, classification_score] = getClassAndScoreFromClassifications(classifications[0]);

        trafficLight.score = classification_score
        trafficLight.class = classification_class;
      });
      return Promise.resolve(trafficLight);
    })).then(data => {return data;})

    console.log('predictions', predictions); // bg g r y
    return predictions;
  }

  useEffect(() => {
    loadModel();
  }, [])

   const onChooseOption = (option) => {
      switch(option) {
        case 'photo':
          console.log('photo');
          setOption('photo')
          break;
        case 'realTime':
          console.log('realTime');
          setOption('realTime')
          break;
        case 'about':
          console.log('about');
          setOption('about')
          break;
        default:
          setOption('menu')
          break;
      }
    }

    return (<>
      {
      (model !== null && detector !== null) ? 
        {
          photo: <TakePhoto onChooseOption={onChooseOption} getPredictions={getPredictions}/>,
          realTime: <TakePhoto onChooseOption={onChooseOption} getPredictions={getPredictions} realTime={true} />,
          about: <Menu onChooseOption={onChooseOption}/>,
          menu: <Menu onChooseOption={onChooseOption}/>
        }[option]
      : 
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Wait for models to load</Text>
        </View>
      }
    </>)
}
