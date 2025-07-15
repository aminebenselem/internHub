import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, children }) => {
  if (isAllowed === false) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
