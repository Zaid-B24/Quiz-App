import { useCallback, useContext, useEffect, useState } from 'react';

import Trending from './Trending';
import styles from './styles/Dashboard.module.css';
import StatsCard from '../StatsCard';
import { AuthContext } from '../../../store/AuthProvider';

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const { user } = useContext(AuthContext);
  
    const fetchStats = useCallback(async () => {
      try {
        if (!user) {
          throw new Error('User not found');
        }
  
        const res = await fetch(
          import.meta.env.VITE_BACKEND_URL + 'users/stats',
          {
            headers: {
              Authorization: 'Bearer ' + user,
            },
          }
        );
  
        if (!res.ok) {
          throw new Error("Couldn't fetch data");
        }
  
        const resObj = await res.json();
  
        return resObj;
      } catch (error) {
        console.error(error.message);
      }
    }, [user]);
  
    useEffect(() => {
      fetchStats().then((data) => setStats(data.data.stats));
    }, [fetchStats]);
  
    return (
      <div className={styles.container}>
        <div className={styles.stats}>
          <StatsCard
            color={'#FF5D01'}
            number={stats.totalQuizzesAndPolls}
            text="Quiz created"
          />
          <StatsCard
            color={'#60B84B'}
            number={stats.totalQuestions}
            text="Questions created"
          />
          <StatsCard
            color={'#5076FF'}
            number={stats.totalImpressions}
            text="Total Impressions"
          />
        </div>
  
        <Trending />
      </div>
    );
  }