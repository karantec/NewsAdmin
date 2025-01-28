import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import {Link, useNavigate} from 'react-router-dom'
import TemplatePointers from '../../features/user/components/TemplatePointers'

function InternalPage(){
  const navigate = useNavigate();

  useEffect(() => {
      // Check for authentication token
      if (!localStorage.getItem('authToken')) {
        console.log('No token found');
          navigate('/login'); // Redirect to login if not authenticated
      }
  }, [navigate]);

  return (
      <div className="hero h-4/5 bg-base-200">
          <div className="hero-content">
              <div className="max-w-md">
                  <TemplatePointers />
                  <button className="btn bg-base-100 btn-outline">Welcome to the Dashboard</button>
              </div>
          </div>
      </div>
  );
}

export default InternalPage