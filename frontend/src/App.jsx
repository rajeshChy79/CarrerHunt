import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

// Public pages
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import Description from './components/Description'

// Admin pages
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetUp from './components/admin/CompanySetUp'
import AdminJobs from './components/admin/AdminJobs'
import PostJobs from './components/admin/PostJobs'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'

// Optional: A simple NotFound component
const NotFound = () => <div className="text-center mt-10 text-2xl">404 - Page Not Found</div>;

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/description/:id', element: <Description /> },
  { path: '/browse', element: <Browse /> },
  { path: '/profile', element: <Profile /> },

  // Admin routes
  { path: '/admin/companies', element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> },
  { path: '/admin/companies/:id', element: <ProtectedRoute><CompanySetUp /></ProtectedRoute> },
  { path: '/admin/jobs', element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
  { path: '/admin/jobs/create', element: <ProtectedRoute><PostJobs /></ProtectedRoute> },
  { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute><Applicants /></ProtectedRoute> },

  // Catch-all route for 404s
  { path: '*', element: <NotFound /> }
]);

function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;
