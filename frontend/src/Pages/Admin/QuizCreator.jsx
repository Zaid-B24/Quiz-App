import { useCallback, useContext, useState } from 'react';
import { Tab,TabGroup,TabPanels, TabList, TabPanel } from '@headlessui/react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';
import { AuthContext } from '../../store/AuthProvider';
import { ModalContext } from './Navigation';
import Options from './Options';
import QuestionCreator from './QuestionCreator';
import Timer from './Timer';
import copyLink from '../../utils/copyLink';
import styles from './styles/QuizCreator.module.css';
import Button from '../../Components/ButtonComponent';

const defaultQuiz = (name, type, actions, defaultData) => {
  if (actions === 'update') {
    return defaultData;
  }

  return {
    category: type,
    name: name,
    timer: null,
    questions: [
      {
        _id: uuid(),
        question: '',
        optionsType: 'text',
        options: [{ text: '' }, { text: '' }],
        answer: 0,
      },
    ],
  };
};

export default function QuizCreator({
  quizName,
  quizType,
  defaultData,
  actions,
  toggleEditModal,
}) {
  const [quiz, setQuiz] = useImmer(() =>
    defaultQuiz(quizName, quizType, actions, defaultData)
  );
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [createdQuiz, setCreatedQuiz] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toggleModal } = useContext(ModalContext);

  const getQuestion = (state, id) => {
    const question = state.questions.find((question) => question._id == id);

    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  };

  const handleQuestionChange = (id, val) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, id);
      question.question = val;
    });
  };

  const addQuestion = () => {
    const defaultQuestion = {
      _id: uuid(),
      question: '',
      optionsType: 'text',
      options: [{ text: '' }, { text: '' }],
      answer: 0,
    };

    setQuiz((draft) => {
      draft.questions.push(defaultQuestion);
    });

    setSelectedTabIndex(quiz.questions.length);
  };

  const deleteQuestion = (id, index) => {
    setQuiz((draft) => {
      draft.questions = draft.questions.filter((q) => q._id !== id);
    });

    setSelectedTabIndex(index - 1);
  };

  const resetOptions = (id, type) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, id);
      if (type == 'text') {
        question.options = [{ text: '' }, { text: '' }];
      } else if (type == 'image') {
        question.options = [{ image: '' }, { image: '' }];
      } else {
        question.options = [
          { text: '', image: '' },
          { text: '', image: '' },
        ];
      }
    });
  };

  const handleOptionsTypeChange = (id, type) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, id);
      question.optionsType = type;
    });

    resetOptions(id, type);
  };

  const addOption = (id, type) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, id);

      let option;

      if (type == 'text') {
        option = { text: '' };
      } else if (type == 'image') {
        option = { image: '' };
      } else {
        option = { text: '', image: '' };
      }

      question.options.push(option);
    });
  };

  const deleteOption = (id, index) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, id);
      question.options.splice(index, 1);
    });
  };

  const handleAnswerChange = (id, index) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, id);
      question.answer = index;
    });
  };

  const handleOptionChange = (id, index, type, val) => {
    setQuiz((draft) => {
      const question = getQuestion(draft, id);
      question.options[index][type] = val;
    });
  };

  const setTimer = (time) => {
    setQuiz((draft) => {
      draft.timer = time;
    });
  };

  const createOrUpdateQuiz = useCallback(async () => {
    setIsProcessing(true);

    const hasEmptyQuestion = quiz.questions.some(q => !q.question.trim());

  if (hasEmptyQuestion) {
    toast.error('Question required');
    setIsProcessing(false);
    return;
  }

    let updatedQuiz = { ...quiz };

    // remove _id property from default quiz questions when creating a new quiz
    if (actions !== 'update') {
      const updatedQuestions = quiz.questions.map((el) => ({
        question: el.question || '',
        optionsType: el.optionsType,
        options: el.options || [],
        answer: el.answer || 0,
      }));

      updatedQuiz.questions = updatedQuestions;
    }

    const resource = quiz.category === 'quiz' ? 'quizzes/' : 'polls/';
    let url = import.meta.env.VITE_BACKEND_URL + resource;

    if (actions === 'update') {
      url = import.meta.env.VITE_BACKEND_URL + resource + quiz._id;
    }

    try {
      if (!user) {
        throw new Error('User not found');
      }

      const res = await fetch(url, {
        method: actions === 'update' ? 'PATCH' : 'POST',
        body: JSON.stringify(updatedQuiz),
        headers: {
          Authorization: 'Bearer ' + user,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const errJSON = await res.json();
        console.log(errJSON);
        throw new Error(errJSON.message);
      }

      if (actions !== 'update') {
        const resJson = await res.json();
        setCreatedQuiz(resJson.data.quiz );
      }

      toast.success('Successfully created quiz');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);

      if (actions == 'update') {
        toggleEditModal();
        navigate(0);
      } else {
        setShowResult(true);
      }
    }
  }, [quiz, user, actions, navigate, toggleEditModal]);

  const getLink = (id, type) => {
    const url = new URL(window.location.href);
    url.pathname = '';
    const modifiedUrl = url.href;
    return `${modifiedUrl}user/${type}/${id}`;
  };

  const handleToggle = () => {
    if (actions == 'update') {
      toggleEditModal();
    } else {
      toggleModal();
    }
  };

  return (
    <div>
      {showResult && createdQuiz ? (
        <div className={styles.results}>
          <h1>
            Congrats your {quizType === 'quiz' ? 'quiz' : 'poll'} is published.
          </h1>
          <p>{getLink(createdQuiz._id, quizType)}</p>

          <Button
            onClick={() => copyLink(createdQuiz._id, quizType)}
            variant="primary"
          >
            Share quiz
          </Button>
        </div>
      ) : (
        <>
          <TabGroup
            selectedIndex={selectedTabIndex}
            onChange={setSelectedTabIndex}
          >
            <TabList className={styles.list}>
              <div className={styles.tabs}>
                {quiz.questions.map((q, index) => (
                  <Tab as="div" key={q._id}>
                    {({ selected }) => (
                      <div
                        className={selected ? styles.selectedTab : styles.tab}
                      >
                        {actions !== 'update' && index >= 1 && (
                          <button
                            onClick={() => deleteQuestion(q._id, index)}
                            className={styles.cross}
                          >
                            <X size={16} />
                          </button>
                        )}
                        {index + 1}
                      </div>
                    )}
                  </Tab>
                ))}

                {actions !== 'update' && quiz.questions.length < 5 && (
                  <button onClick={addQuestion} className={styles.addButton}>
                    <Plus />
                  </button>
                )}
              </div>
              <p>Max 5 questions</p>
            </TabList>
            <TabPanels>
              {quiz.questions.map((q) => (
                <TabPanel key={q.id}>
                  <QuestionCreator
                    question={q}
                    handleQuestionChange={handleQuestionChange}
                    quizType={quizType}
                    handleOptionsTypeChange={handleOptionsTypeChange}
                  >
                    <Options
                      actions={actions}
                      question={q}
                      deleteOption={deleteOption}
                      addOption={addOption}
                      handleAnswerChange={handleAnswerChange}
                      handleOptionChange={handleOptionChange}
                    />
                    {quizType !== 'poll' && (
                      <Timer quiz={quiz} setTimer={setTimer} />
                    )}
                  </QuestionCreator>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          <div className={styles.actions}>
            <Button onClick={handleToggle}>Cancel</Button>
            <Button variant="primary" onClick={createOrUpdateQuiz}>
              {actions === 'update'
                ? isProcessing
                  ? 'Updating..'
                  : 'Update'
                : isProcessing
                ? 'Creating'
                : 'Create'}{' '}
              quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
