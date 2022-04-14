import { useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import './App.css';
import Slider from 'react-slick';

function delay(delayInMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInMs);
  });
}

function App() {
  const [numOfDigits, setNumOfDigits] = useState(4);
  const [listInterval, setListInterval] = useState([]);

  const sliderRef = useRef([]);

  const listDigits = Array.from({ length: 10 }, (_, i) => i);

  useEffect(() => {}, []);

  const onStart = async () => {
    const intervalStack = [];
    for (let i = 0; i < numOfDigits; i++) {
      intervalStack.push(setInterval(() => sliderRef.current[i]?.slickNext()));
      flushSync(() => {
        setListInterval(intervalStack);
      });
      await delay(500);
    }
  };

  const onStop = async () => {
    for (let i = listInterval.length - 1; i > -1; i--) {
      await delay(500);
      clearInterval(listInterval[i]);
    }
    setListInterval([]);
  };

  // useEffect(() => {
  //   sliderRef.current?.slickGoTo(active);
  // }, [active]);

  const settings = {
    infinite: true,
    speed: 50,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow: false,
    vertical: true,
    accessibility: false,
    swipe: false,
  };

  return (
    <div className='app'>
      <div className='container'>
        {Array.from({ length: numOfDigits }, (_, i) => i).map((_) => (
          <div className='display-digit-box' key={_}>
            <div className='list-digit'>
              <Slider {...settings} ref={(ref) => sliderRef.current.push(ref)}>
                {listDigits.map((digit) => (
                  <div key={digit}>
                    <div className='digit-box'>{digit}</div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ))}
      </div>
      <div className='controller'>
        <button onClick={onStart}>Start</button>
        <button onClick={onStop}>Stop</button>
      </div>
    </div>
  );
}

export default App;
