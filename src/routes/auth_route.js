import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { TOKEN_NAME } from '../utilities/constants';
import { setAuthorization } from '../services/axios_client';
import { verify } from '../services/user';

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_NAME);
    const verifyLogedInUser = async () => {
      try {
        await verify();
      } catch (error) {
        return navigate('/login', { replace: true, state: { path: location.pathname } });
      }
    };

    if (!token) {
      return navigate('/login', { replace: true, state: { path: location.pathname } });
    }

    setAuthorization(token);
    verifyLogedInUser();
  }, [location.pathname, navigate]);

  return children;
};

export default AuthRoute;