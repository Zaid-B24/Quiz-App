import styles from './styles/InputForm.module.css';

const InputForm = ({ label, type, register, required, field, error }) => {
    return (
        <div className={styles.inputDiv}>
      <label>{label}</label>
      <div className={styles.group}>
        <input
          type={type}
          className={styles.input}
          {...register(field, { required })}
        />
        <p className={styles.error}>{error?.message}</p>
      </div>
    </div>
    );
};


export default InputForm;
