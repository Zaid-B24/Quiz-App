import { useCallback, useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { AuthContext } from '../../../store/AuthProvider';
import copyLink from '../../../utils/copyLink';
import styles from './styles/Trendings.module.css';
import formatDate from '../../../utils/formatDate';

export default function Trending( ) {
  const [list, setList] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchList = useCallback(async () => {
    try {
      if (!user) {
        throw new Error('User not found');
      }

      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + 'users/trendings',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + user,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Couldn't fetch list");
      }

      const resJson = await res.json();
      return resJson;
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    fetchList().then((data) => setList(data.data.docs));
  }, [fetchList]);

  return (
    <div className={styles.container}>
      <h2>Trending Quizzes</h2>

      {list && (
        <div className={styles.quizCards}>
          {list.map((el) => (
            <div
              type="button"
              onClick={() => copyLink(el._id, el.category)}
              key={el._id}
              className={styles.card}
            >
              <div>
                <p className={styles.name}>{el.name}</p>
                <div className={styles.impressions}>
                  <p>{el.impressions}</p>
                  <Icon style={{ fontSize: '1.5rem' }} icon="iconoir:eye" />
                </div>
              </div>
              <p className={styles.date}>
                Created on: {formatDate(el.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}