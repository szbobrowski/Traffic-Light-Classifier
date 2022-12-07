import React, {useEffect, useState} from 'react';
import Menu from './components/Menu';
import TakePhoto from './components/TakePhoto'
import * as tf from '@tensorflow/tfjs'
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [option, setOption] = useState('menu');
  const [model, setModel] = useState();
  const [detector, setDetector] = useState();

  const loadModel = async () => {
    const modelJSON = require('./classifier-models/model.json');
    const modelWeights1 = require('./classifier-models/group1-shard1of3.bin');
    const modelWeights2 = require('./classifier-models/group1-shard2of3.bin');
    const modelWeights3 = require('./classifier-models/group1-shard3of3.bin');

    const detectorJSON = require('./detector-models/model.json')
    const detectorWeights1 = require('./detector-models/group1-shard1of3.bin');
    const detectorWeights2 = require('./detector-models/group1-shard2of3.bin');
    const detectorWeights3 = require('./detector-models/group1-shard3of3.bin'); 

    await tf.ready();

    const model = await tf.loadGraphModel(
        bundleResourceIO(modelJSON, [
          modelWeights1,
          modelWeights2,
          modelWeights3
        ])
    ).catch((e) => {
      console.log("[LOADING MODEL ERROR] info:", e);
    })

    const detector = await tf.loadGraphModel(
        bundleResourceIO(detectorJSON, [
          detectorWeights1,
          detectorWeights2,
          detectorWeights3
        ])
    ).catch((e) => {
      console.log("[LOADING DETECTOR ERROR] info:", e);
    })
    
    setModel(model);
    console.log('model loaded');

    setDetector(detector);
    console.log('detector loaded');
  }

  const transformImageToTensor = async (uri) => {
      const img64 = await FileSystem.readAsStringAsync(uri, {encoding:FileSystem.EncodingType.Base64})
      const imgBuffer =  tf.util.encodeString(img64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      let imgTensor = decodeJpeg(raw);

      imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [640, 640])

      const img = tf.reshape(imgTensor, [1,640,640,3])
      console.log('img', img);

      // return img.toFloat();
      return img.toInt();
  }

  const makePredictions = async ( batch, model, imagesTensor ) => {
    // const predictionsdata = model.predict(imagesTensor).arraySync();
    const predictionsdata = model.executeAsync(imagesTensor);
     
    return predictionsdata;
  }

  const getPredictions = async (image) => {
    await tf.ready();

    const tensorImage = await transformImageToTensor(image);
    // const predictions = await makePredictions(1, model, tensorImage);
    const detections = await makePredictions(1, detector, tensorImage);

    // console.log(predictions); // bg g r y
    console.log('1', detections[1].dataSync()[0]);
    // console.log('2', detections[2].dataSync());
    // console.log('4', detections[4].dataSync());
    // console.log('6', detections[6].dataSync());
    // console.log('7', detections[7].dataSync());
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
