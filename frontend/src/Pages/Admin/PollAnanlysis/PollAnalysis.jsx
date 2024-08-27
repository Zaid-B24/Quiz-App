import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles/Poll.module.css';
import formatDate from '../../../utils/formatDate'
import StatsCard from '../StatsCard';

export default function PollAnalysis() {
    const params = useParams();
    const { pollId } = params;
  
    const [poll, setPoll] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const fetchQuiz = useCallback(async () => {
      setError(null);
      setIsLoading(true);
  
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + 'polls/' + pollId
        );
  
        if (!res.ok) {
          const errJson = res.json();
          throw new Error(errJson.mesage ?? 'Poll not found');
        }
  
        const resJson = await res.json();
        setPoll(resJson.data.poll);
      } catch (error) {
        setError(error);
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }, [pollId]);
  
    useEffect(() => {
      fetchQuiz();
    }, [fetchQuiz]);
  
    let content;
  
    if (isLoading) {
      content = <p>Loading...</p>;
    } else if (error) {
      content = <p>{error.message}</p>;
    } else if (poll) {
      content = (
        <div className={styles.container}>
          <div className={styles.headers}>
            <h1>{poll.name}</h1>
            <div className={styles.meta}>
              <p>Created on: {formatDate(poll.createdAt)}</p>
              <p>Impressions: {poll.impressions}</p>
            </div>
          </div>
  
          <div className={styles.questions}>
            {poll.questions.map((q, index) => (
              <div key={q._id} className={styles.question}>
                <h2>
                  Q.{index + 1} {q.question}
                </h2>
  
                <div className={styles.statsCards}>
                  {q.options.map((op, index) => (
                    <StatsCard
                      key={op._id}
                      number={op.votes}
                      text={op?.text || 'Option' + index}
                    />
                  ))}
                </div>
  
                {poll.questions.length - 1 !== index && (
                  <div className={styles.divider}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    return <div>{content}</div>;
  }
  