import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';
import Button from '../../../Components/ButtonComponent';
import Question from '../Question';
import Timer from '../Timer';
import styles from "./styles/index.module.css"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Quiz () {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useImmer([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentQuestion = quiz?.questions[index];

  // Fetch quiz data
  const fetchQuiz = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}quizzes/${quizId}`);

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message ?? 'Quiz not found');
      }

      const resJson = await res.json();
      setQuiz(resJson.data.quiz);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  // Submit answers
  const submitAnswers = useCallback(
    async (results) => {
      try {
        const res = await fetch(`${backendUrl}quizzes/attempt/${quizId}`, {
          method: 'PATCH',
          body: JSON.stringify({ results }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const resError = await res.json();
          throw new Error(resError.message ?? 'Could not submit answers');
        }

        const resData = await res.json();
        localStorage.setItem('userScore', JSON.stringify(resData.data.userResults));
      } catch (error) {
        console.log(error.message);
      }
    },
    [quizId]
  );

  // Handle question index
  const handleIndex = useCallback(() => {
    if (index >= quiz.questions.length - 1) {
      submitAnswers(results).then(() => navigate('/user/quiz/results'));
    } else {
      setIndex(prev => prev + 1);
    }
  }, [index, quiz, results, submitAnswers, navigate]);

  // Add result to state
  const addResult = useCallback((result) => {
    setResults(draft => {
      const existingIndex = draft.findIndex(res => res.questionId === result.questionId);
      if (existingIndex !== -1) {
        draft[existingIndex] = result;
      } else {
        draft.push(result);
      }
    });
  }, [setResults]);

  // Render content
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>{error}</p>;
  } else if (quiz) {
    content = (
      <>
        <div className={styles.meta}>
          <p className={styles.count}>
            {index + 1}/{quiz.questions.length}
          </p>
          {quiz.timer && (
            <Timer
              key={index}
              timer={quiz.timer}
              handleTimerEnd={handleIndex}
            />
          )}
        </div>
        <Question
          key={currentQuestion._id}
          addResult={addResult}
          question={currentQuestion}
        />
        <Button variant={'primary'} onClick={handleIndex}>
          {index >= quiz.questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </>
    );
  }
  return <div className={styles.container}>{content}</div>;
}