import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AdminLayout from './Pages/Admin';
import Analytics from './Pages/Admin/Analytics/Analytics';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import Auth from "./Pages/Authorization/Auth"
import Poll from "./Pages/User/Poll";
import Quiz from './Pages/User/Quiz'
import UserLayout from './Pages/User'
import AuthProvider from "./store/AuthProvider";
import QuizResults from './Pages/User/Quiz/QuizResult';
import PollResults from './Pages/User/Poll/PollResults';
import QuizAnalysis from './Pages/Admin/QuizAnalysis/QuizAnalysis';
import PollAnalysis from './Pages/Admin/PollAnanlysis/PollAnalysis';


const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '',

        element: (
          <AuthProvider>
            <AdminLayout />
          </AuthProvider>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'analytics', element: <Analytics /> },
          { path: 'poll/:pollId', element: <PollAnalysis /> },
          { path: 'quiz/:quizId', element: <QuizAnalysis /> },
        ],
      },
      {
        path: 'auth',
        element: (
          <AuthProvider>
            <Auth />
          </AuthProvider>
        ),
      },
      {
        path: 'login',
        element: (
          <AuthProvider>
            <Auth />
          </AuthProvider>
        ),
      },
      {
        path: 'user',
        element: <UserLayout />,
        children: [
          {
            path: 'quiz',
            children: [
              { path: ':quizId', element: <Quiz /> },
              { path: 'results', element: <QuizResults /> },
            ],
          },
          {
            path: 'poll',
            children: [
              { path: ':pollId', element: <Poll /> },
              { path: 'results', element: <PollResults /> },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <p>Route not found</p>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
