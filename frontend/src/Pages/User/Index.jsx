import { Outlet } from 'react-router-dom';
import styles from './styles/index.module.css';

export default function UserLayout () {
    return (
        <div className={styles.main}>
            <div className={styles.outlet}>
                <Outlet />
            </div>
        </div>
    )
}