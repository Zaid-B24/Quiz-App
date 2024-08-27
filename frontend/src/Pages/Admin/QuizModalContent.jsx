import { useContext, useEffect, useState } from 'react';

import QuizCreator from './QuizCreator';
import QuizInitiator from './QuizInitiator';
import { ModalContext } from './Navigation';

export default function QuizModalContent() {
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('quiz');

  const { isOpen } = useContext(ModalContext);

  useEffect(() => {
    if (!isOpen) {
      setIsCreatingQuiz(false);
    }
  }, [isOpen]);

  return (
    <div>
      {isCreatingQuiz ? (
        <QuizCreator quizName={quizName} quizType={quizType} />
      ) : (
        <QuizInitiator
          quizType={quizType}
          setQuizType={setQuizType}
          setQuizName={setQuizName}
          setIsCreatingQuiz={setIsCreatingQuiz}
        />
      )}
    </div>
  );
}
