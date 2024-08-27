import { createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import logo from '../../assets/QUIZZIE.png';
import Button from '../../Components/ButtonComponent';
import Modal from '../../Components/Modal';
import { AuthContext } from '../../store/AuthProvider';
import styles from './styles/Navigation.module.css';
import QuizModalContent from './QuizModalContent';

export const ModalContext = createContext({
    isOpen: false,
    toggleModal: () => {},
  });

  export default function Naviagtion() {
    const { isOpen, toggleModal } = useModal();
    const { user, logOut } = useContext(AuthContext);
  
    return (
      <ModalContext.Provider value={{ isOpen, toggleModal }}>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src={logo} alt="logo" />
          </div>
  
          <div className={styles.navs}>
            <Link to="/">
              <Button
                variant="ghost"
                style={{ width: '100%', fontWeight: '400', fontSize: '1.2rem' }}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/analytics">
              <Button
                variant="ghost"
                style={{ width: '100%', fontWeight: '400', fontSize: '1.2rem' }}
              >
                Analytics
              </Button>
            </Link>
            <Button
              onClick={toggleModal}
              variant="ghost"
              style={{ width: '100%', fontWeight: '400', fontSize: '1.2rem' }}
            >
              Create Quiz
            </Button>
          </div>
  
          <div className={styles.button}>
            {user && (
              <Button
                onClick={logOut}
                variant="ghost"
                style={{ width: '100%', fontWeight: '400', fontSize: '1.2rem' }}
              >
                LOGOUT
              </Button>
            )}
          </div>
        </div>
  
        {isOpen && (
          <Modal toggleModal={toggleModal}>
            <QuizModalContent />
          </Modal>
        )}
      </ModalContext.Provider>
    );
  }