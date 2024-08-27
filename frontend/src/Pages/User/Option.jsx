import styles from './styles/Option.module.css';

export default function Option({ op, index, selected, onClick }) {
  const seletedStyles = selected == index ? styles.selected : '';

  return (
    <div onClick={onClick} className={`${seletedStyles} ${styles.option}`}>
     {op.text && <div>{op.text}</div>}
      {op.image && (
        <div className={styles.image}>
          <img src={op.image} alt="" />
        </div>
      )}
    </div>
  );
}
