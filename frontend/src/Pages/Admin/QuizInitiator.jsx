import { useCallback, useContext } from 'react';
import useInput from '../../hooks/useInput';
import styles from './styles/QuizInitiator.module.css';
import { ModalContext } from './Navigation';
import Button from '../../Components/ButtonComponent';
import Input from '../../Components/Input';
import toast from 'react-hot-toast';

export default function QuizInitiator({
  setIsCreatingQuiz,
  quizType,
  setQuizName,
  setQuizType,
}) {
  const { toggleModal } = useContext(ModalContext);
  const inputProps = useInput();

  const handleProceed = useCallback(() => {
    if (!inputProps.value.trim()) {
      toast.error("Quiz name is required");
      return;
    }
  
    setIsCreatingQuiz(true);
    setQuizName(inputProps.value);
  }, [inputProps.value, setIsCreatingQuiz, setQuizName]);

  

  return (
    <div>
      <Input {...inputProps} placeholder="Quiz name" />
      <div className={styles.quizType}>
        <p>Quiz Type</p>
        <Button
          variant={quizType == 'quiz' ? 'primary' : ''}
          onClick={() => setQuizType('quiz')}
        >
          Q&A
        </Button>
        <Button
          variant={quizType == 'poll' ? 'primary' : ''}
          onClick={() => setQuizType('poll')}
        >
          Poll
        </Button>
      </div>
      <div className={styles.actions}>
        <Button onClick={toggleModal}>Cancel</Button>
        <Button variant="primary" onClick={handleProceed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
