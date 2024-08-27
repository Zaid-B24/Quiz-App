import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Naviagtion from './Navigation';
import { AuthContext } from '../../store/AuthProvider';
import styles from './styles/index.module.css';

export default function AdminLayout() {
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!user && !isLoading) {
        navigate('/auth');
      }
    }, [user, navigate, isLoading]);
  
    return (
      <>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          user && (
            <div className={styles.main}>
              <div className={styles.navigation}>
                <Naviagtion />
              </div>
              <div className={styles.outlet}>
                <Outlet />
              </div>
            </div>
          )
        )}
      </>
    );
  }