import './App.css';
import {useState, useEffect} from 'react';

import removeBackground, { utils } from '@cesdk/background-removal';

function calculateSecondsBetweenDates(startDate, endDate) {
  const milliseconds = endDate - startDate;
  const seconds = (milliseconds/1000.0).toFixed(1)
  return seconds;
}


function App() {
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1686002359940-6a51b0d64f68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80");
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(calculateSecondsBetweenDates(startDate, Date.now()));
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const resetTimer = () => {
    setIsRunning(true);
    setStartDate(Date.now());
    setSeconds(0);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  async function load() {
    setIsRunning(true);
    resetTimer();
    const response = await fetch(imageUrl, {})
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    const inputImageData = utils.imageBitmapToImageData(imageBitmap);
    const imageData = await removeBackground(inputImageData, {debug: true, resolution: 1024, proxyToWorker: true});
    const url = utils.imageDataToDataUrl(imageData)
    setImageUrl(url)
    utils.imageDataDownload(imageData, "result.png");     
    setIsRunning(false);
    stopTimer()
}

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={imageUrl} className="App-logo" alt="logo" />
        <p>
          Testing background removal: {seconds} s
        </p>
        <button disabled={isRunning} onClick={() => load() }>Click me</button>
      </header>
    </div>
  );
}

export default App;
