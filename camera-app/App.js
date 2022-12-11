import React, {useEffect, useState} from 'react';
import Menu from './components/Menu';
import TakePhoto from './components/TakePhoto'
import * as tf from '@tensorflow/tfjs'
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
import * as FileSystem from 'expo-file-system';
import * as cocossd from "@tensorflow-models/coco-ssd";

export default function App() {
  const [option, setOption] = useState('menu');
  const [model, setModel] = useState();
  const [detector, setDetector] = useState();

  const loadModel = async () => {
    const modelJSON = require('./models/model.json')
    const modelWeights1 = require('./models/group1-shard1of3.bin')
    const modelWeights2 = require('./models/group1-shard2of3.bin')
    const modelWeights3 = require('./models/group1-shard3of3.bin')

    await tf.ready();

    const model = await tf.loadGraphModel(
        bundleResourceIO(modelJSON, [
          modelWeights1,
          modelWeights2,
          modelWeights3
        ])
    ).catch((e) => {
      console.log("[LOADING ERROR] info:", e);
    })
    
    setModel(model);
    console.log('model loaded');

    const detector = await cocossd.load();
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

  const getPredictions = async (image) => {
    await tf.ready();

    const tensorImage = await transformMainImageToTensor(image);
    const detections = await detect(detector, tensorImage);

    console.log('img', image);

    console.log('detections before', detections);

    detections.filter(detection => detection.class === 'traffic light').forEach(trafficLight => {
      console.log(trafficLight);
    })

    console.log('detections after', detections);

    // const tensorImage = await transformImageToTensor(image);
    // const predictions = await makePredictions(1, model, tensorImage);

    // console.log(predictions); // bg g r y
    return detections
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

    switch(option) {
      case 'photo':
        return (
          <TakePhoto onChooseOption={onChooseOption} getPredictions={getPredictions}/>
        );
      case 'realTime':
        return (
          <TakePhoto onChooseOption={onChooseOption}/>
        );
      case 'about':
        return (
          <Menu onChooseOption={onChooseOption}/>
        );
      default:
        return (
          <Menu onChooseOption={onChooseOption}/>
        );
    }
}
