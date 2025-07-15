import { useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AdminDashboard } from './pages/AdminDashboard';
import { InternDashboard } from './pages/InternDashboard';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';
import { InternDetails } from './pages/InternDetails';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const isIntern = role === 'intern';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute isAllowed={isAdmin}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern"
          element={
            <ProtectedRoute isAllowed={isIntern}>
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:internId"
          element={
            <ProtectedRoute isAllowed={isAdmin}>
              <InternDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
