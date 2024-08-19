import { useEffect, useState } from "react";
import ProgressBar from './ProgressBar.jsx'
const TIMER = 3000

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('INTERVAL')
      setRemainingTime(prevTime => prevTime - 10)
    }, 10)


    return () => {
      console.log('Cleaning up timer')
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    console.log("timer set")
    const timer = setTimeout(() => {
      onConfirm()
    }, TIMER)

    return () => {
      console.log("Cleaning up timer")
      clearTimeout(timer)
    }
  }, [])



  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
