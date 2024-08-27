import React, { useMemo, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import styles from './styles/Timer.module.css';

export default function Timer({ timer, handleTimerEnd }) {
  // Memoize expiry timestamp to avoid recreation on every render
  const expiryTimestamp = useMemo(() => {
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + timer);
    return expiry;
  }, [timer]);

  const { seconds, isRunning, restart } = useTimer({
    expiryTimestamp,
    onExpire: handleTimerEnd,
  });

  useEffect(() => {
    restart(expiryTimestamp);
  }, [restart, expiryTimestamp]);

  return (
    <div className={styles.timer}>
      <p>{seconds}s</p>
    </div>
  );
}
