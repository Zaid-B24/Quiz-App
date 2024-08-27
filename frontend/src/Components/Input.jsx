import styles from './styles/Input.module.css';

export default function Input({ type, placeholder, value, onChange }) {
  return (
    <div className={styles.inputDiv}>
      <div className={styles.group}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className={styles.input}
        />
      </div>
    </div>
  );
}
