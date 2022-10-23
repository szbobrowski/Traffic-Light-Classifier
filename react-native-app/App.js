import React, {useState} from 'react';
import Menu from './components/Menu';
import TakePhoto from './components/TakePhoto'

export default function App() {
  const [option, setOption] = useState('menu');

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
          console.log('menu');
          setOption('menu')
          break;
      }
    }

    switch(option) {
      case 'photo':
        return (
          <TakePhoto />
        );
      case 'realTime':
        return (
          <TakePhoto />
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
