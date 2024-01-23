import { useEffect, useState } from 'react';
import classes from './LoadingScreen.module.css';
import { ReactComponent as SpinnerIcon } from './icons/Spinner.svg';

interface LoadingScreenProps {
  text: string;
  lastInferenceTime?: number;
}

function LoadingScreen({ text, lastInferenceTime }: LoadingScreenProps) {
  const [stopwatch, setStopwatch] = useState(0);

  useEffect(() => {
    let timerInstance: any;
    let startTime = Date.now();

    timerInstance = setInterval(() => {
      setStopwatch(() => (Date.now() - startTime) / 1000);
    }, 10);

    return () => clearInterval(timerInstance);
  }, []);

  return (
    <>
      <div className={classes.processingOverlay}>
        <SpinnerIcon />
        <p className={classes.processMessage}>{text}</p>

        <p className={classes.processStatus}>
          {stopwatch.toFixed(2) + 's'}
          {lastInferenceTime && '/' + lastInferenceTime.toFixed(2) + 's'}
        </p>
      </div>
    </>
  );
}

export default LoadingScreen;
