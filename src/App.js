import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import './App.css';
import Slider from 'react-slick';

function delay(delayInMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayInMs);
  });
}

function getNumOfDigits(number) {
  return String(number).length;
}

function getRandomNumberInRange(min, max) {
  const randomNumber = Math.floor(Math.random() * max);
  if (randomNumber < min) {
    return getRandomNumberInRange(min, max);
  } else {
    return randomNumber;
  }
}

const sliderSettings = {
  infinite: true,
  speed: 50,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrow: false,
  vertical: true,
  accessibility: false,
  swipe: false,
};

function App() {
  const [valueRange, setValueRange] = useState({ min: 0, max: 100 });
  const [listInterval, setListInterval] = useState([]);
  const [delayTime, setDelayTime] = useState(5);
  const [delayTimeBetweenDigits, setDelayTimeBetweenDigits] = useState({
    start: 0.5,
    end: 0.5,
  });
  // const [result, setResult] = useState(null);

  const sliderRef = useRef([]);
  sliderRef.current = [];

  const listDigits = Array.from({ length: 10 }, (_, i) => i);

  const numOfDigits = useMemo(
    () => getNumOfDigits(valueRange.max),
    [valueRange.max]
  );

  const onStart = async () => {
    // setResult(null);
    if (Number(valueRange.max) <= Number(valueRange.min)) {
      return;
    }
    const intervalStack = [];
    for (let i = 0; i < numOfDigits; i++) {
      intervalStack.push(setInterval(() => sliderRef.current[i].slickNext()));
      flushSync(() => {
        setListInterval(intervalStack);
      });
      await delay(delayTimeBetweenDigits.start * 1000);
    }
  };

  const onStop = useCallback(async () => {
    // let resultInString = result;
    // if (!result) {
    const random = getRandomNumberInRange(valueRange.min, valueRange.max);
    const resultTemp =
      String('0').repeat(numOfDigits - String(random).length) + String(random);
    //   resultInString = resultTemp;
    //   setResult(resultTemp);
    // }
    // const lastIntervalIndex = listInterval.length - 1;
    // clearInterval(listInterval[lastIntervalIndex]);
    // await delay(100);
    // sliderRef.current[lastIntervalIndex].slickGoTo(
    //   Number(resultInString[lastIntervalIndex])
    // );
    // setListInterval((prev) => {
    //   prev.pop();
    //   return prev;
    // });
    for (let i = listInterval.length - 1; i > -1; i--) {
      await delay(delayTimeBetweenDigits.end * 1000);
      clearInterval(listInterval[i]);
      await delay(100);
      sliderRef.current[i].slickGoTo(Number(resultTemp[i]));
    }
    setListInterval([]);
  }, [valueRange, listInterval, numOfDigits, delayTimeBetweenDigits.end]);

  const onChangeRange = ({ target }) => {
    if (!isDrawing) {
      setValueRange((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const onChangeDelay = ({ target }) => {
    if (!isDrawing) {
      setDelayTime(target.value);
    }
  };

  const onChangeDelayTimeBetweenDigits = ({ target }) => {
    if (!isDrawing) {
      setDelayTimeBetweenDigits((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const addToRefs = (el) => {
    if (el && !sliderRef.current.includes(el)) {
      sliderRef.current.push(el);
    }
  };

  const isDrawing = listInterval.length > 0;

  useEffect(() => {
    let delayStop = null;
    if (isDrawing) {
      delayStop = setTimeout(() => {
        onStop();
      }, numOfDigits * 500 + Number(delayTime) * 1000);
    }
    return () => {
      clearTimeout(delayStop);
    };
  }, [isDrawing, numOfDigits, delayTime, onStop]);

  return (
    <div className='app'>
      <div className='container'>
        {Array.from({ length: numOfDigits }, (_, i) => i).map((_) => (
          <div className='display-digit-box' key={_}>
            <div className='list-digit'>
              {numOfDigits > 0 && (
                <Slider {...sliderSettings} ref={addToRefs}>
                  {listDigits.map((digit) => (
                    <div key={digit}>
                      <div className='digit-box'>{digit}</div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className='controller'>
        <div>
          <div className='input-block'>
            <label>From:</label>
            <input
              name='min'
              type='number'
              disabled={isDrawing}
              onChange={onChangeRange}
              value={valueRange.min}
            />
          </div>
          <div className='input-block'>
            <label>To:</label>
            <input
              name='max'
              type='number'
              disabled={isDrawing}
              onChange={onChangeRange}
              value={valueRange.max}
            />
          </div>
          <div className='input-block'>
            <label>Delay in (s):</label>
            <input
              name='delay'
              type='number'
              disabled={isDrawing}
              onChange={onChangeDelay}
              value={delayTime}
            />
          </div>
          <div className='input-block'>
            <label>Delay between digits at the begin (s):</label>
            <input
              name='start'
              type='number'
              disabled={isDrawing}
              onChange={onChangeDelayTimeBetweenDigits}
              value={delayTimeBetweenDigits.start}
            />
          </div>
          <div className='input-block'>
            <label>Delay between digits at the finish (s):</label>
            <input
              name='end'
              type='number'
              disabled={isDrawing}
              onChange={onChangeDelayTimeBetweenDigits}
              value={delayTimeBetweenDigits.end}
            />
          </div>
        </div>
        <button onClick={onStart} disabled={isDrawing}>
          Start
        </button>
      </div>
    </div>
  );
}

export default App;
