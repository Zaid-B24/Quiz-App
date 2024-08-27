import styles from './styles/StatsCard.module.css';

export default function StatsCard({ number, text, color }) {
  if (number > 1000) {
    number = (number / 1000).toFixed(1) + 'k';
  }

  return (
    <div style={{ color }} className={styles.container}>
      <p className={styles.number}>{number}</p>
      <p className={styles.text}>{text}</p>
    </div>
  );
}