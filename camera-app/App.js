import React, {useState} from 'react';
import Menu from './components/Menu';
import TakePhoto from './components/TakePhoto'

export default function App() {
  const [option, setOption] = useState('menu');

   const onChooseOption = (option) => {
      switch(option) {
        case 'photo':
          setOption('photo')
          break;
        case 'realTime':
          setOption('realTime')
          break;
        case 'about':
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
          <TakePhoto onChooseOption={onChooseOption}/>
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
