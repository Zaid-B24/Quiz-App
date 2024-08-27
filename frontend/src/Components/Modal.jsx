import styles from './styles/Modal.module.css';

export default function Modal({ children, toggleModal }) {
  return (
    <div className={styles.container}>
      <div onClick={toggleModal} className={styles.backdrop} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
