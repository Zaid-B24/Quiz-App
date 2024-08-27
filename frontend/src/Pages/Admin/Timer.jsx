import Button from "../../Components/ButtonComponent";
import styles from "./styles/Timer.module.css"

export default function Timer({ quiz, setTimer }) {
    const timerOptions = [
      { id: 0, value: null, name: 'OFF' },
      { id: 1, value: 5, name: '5sec' },
      { id: 2, value: 10, name: '10sec' },
    ];
  
    return (
      <div className={styles.timer}>
        <p>Timer</p>
        <div className={styles.timerButtons}>
          {timerOptions.map((el) => (
            <div key={el.id} className="">
              <Button
                variant={quiz.timer == el.value ? 'error' : ''}
                onClick={() => setTimer(el.value)}
              >
                {el.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  