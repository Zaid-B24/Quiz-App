import Input from "../../Components/Input";
import styles from './styles/QuestionCreator.module.css';

const optionTypes = [
  { id: 0, name: 'text', label: 'Text' },
  { id: 1, name: 'image', label: 'Image' },
  { id: 2, name: 'textAndImage', label: 'Text And Image' },
];

export default function QuestionCreator({
  question,
  quizType,
  handleQuestionChange,
  handleOptionsTypeChange,
  children,
}) {
  return (
    <div>
      <Input
        placeholder={`${quizType} question`}
        value={question.question}
        onChange={(val) => handleQuestionChange(question._id, val)}
      />
      <div className={styles.optionsTypeGroup}>
        <p>Option Types</p>

        <div className={styles.optionTypes}>
          {optionTypes.map((type) => (
            <div key={type.id}>
              <input
                type="radio"
                value={type.name}
                onChange={() => handleOptionsTypeChange(question._id, type.name)}
                checked={question.optionsType === type.name}
                id={type.id}
              />
              <label htmlFor={type.id}>{type.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.children}>{children}</div>
    </div>
  );
}
