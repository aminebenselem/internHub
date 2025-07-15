import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import {AdminDashboard} from './pages/AdminDashboard';
import {InternDashboard} from './pages/InternDashboard';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';
import {InternDetails} from './pages/InternDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [role, setRole] = useState(null); // null = not loaded yet

  useEffect(() => {
    const savedRole = localStorage.getItem('role') || sessionStorage.getItem('role');
    setRole(savedRole); // will be "admin", "intern", or null
  }, []);

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
