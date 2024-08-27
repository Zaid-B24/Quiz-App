import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';
import Button from '../../Components/ButtonComponent';
import styles from './styles/auth.module.css';
import Signup from './Signup';
import Login from './Login';
import { memo, useContext, useEffect } from 'react';
import logo from '../../assets/QUIZZIE.png'
import { AuthContext } from '../../store/AuthProvider';
import { useNavigate } from 'react-router-dom';

const MemoizedSignup = memo(Signup);
const MemoizedLogin = memo(Login);

export default function Auth() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(user) {
      navigate('/admin')
    }
  })
  
  return (
    <div className={styles.container}>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#fff',
            color: 'black',
          },
        }}
      />
      <div className={styles.image}>
        <img src={logo} alt="logo" />
      </div>

      <TabGroup>
        <TabList className={styles.tabs}>
          <Tab as="div" className={styles.tab}>
            {({ selected }) => (
              <Button type="button" variant={selected ? '' : 'ghost'}>
                Signup
              </Button>
            )}
          </Tab>
          <Tab as="div" className={styles.tab}>
            {({ selected }) => (
              <Button type="button" variant={selected ? '' : 'ghost'}>
                Login
              </Button>
            )}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <MemoizedSignup />
          </TabPanel>
          <TabPanel>
            <MemoizedLogin />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
