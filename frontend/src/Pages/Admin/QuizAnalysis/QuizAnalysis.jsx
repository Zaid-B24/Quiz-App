import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles/QuizAnalysis.module.css';
import formatDate from '../../../utils/formatDate'
import StatsCard from '../StatsCard';

export default function QuizAnalysis() {
    const params = useParams();
    const { quizId } = params;
  
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const fetchQuiz = useCallback(async () => {
      setError(null);
      setIsLoading(true);
  
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + 'quizzes/' + quizId
        );
  
        if (!res.ok) {
          const errJson = res.json();
          throw new Error(errJson.mesage ?? 'Quiz not found');
        }
  
        const resJson = await res.json();
        setQuiz(resJson.data.quiz);
      } catch (error) {
        setError(error);
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }, [quizId]);
  
    useEffect(() => {
      fetchQuiz();
    }, [fetchQuiz]);
  
    let content;
  
    if (isLoading) {
      content = <p>Loading...</p>;
    } else if (error) {
      content = <p>{error.message}</p>;
    } else if (quiz) {
      content = (
        <div className={styles.container}>
          <div className={styles.headers}>
            <h1>{quiz.name}</h1>
            <div className={styles.meta}>
              <p>Created on: {formatDate(quiz.createdAt)}</p>
              <p>Impressions: {quiz.impressions}</p>
            </div>
          </div>
  
          <div className={styles.questions}>
            {quiz.questions.map((q, index) => (
              <div key={q._id} className={styles.question}>
                <h2>
                  Q.{index + 1} {q.question}
                </h2>
  
                <div className={styles.statsCards}>
                  <StatsCard
                    number={q.attempts}
                    text={'People attempted the question'}
                  />
                  <StatsCard
                    number={q.corrects}
                    text="People ansewerd correctly"
                  />
                  <StatsCard
                    number={q.attempts - q.corrects}
                    text={'People answered incorrectyl'}
                  />
                </div>
  
                {quiz.questions.length - 1 !== index && (
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