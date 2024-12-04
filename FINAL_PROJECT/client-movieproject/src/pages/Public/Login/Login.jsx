import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Toggle show/hide password
  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  // Handle input changes (email, password)
  const handleOnChange = (event, type) => {
    setDebounceState(false);  // Reset debounce flag
    setIsFieldsDirty(true);  // Mark fields as dirty when the user types

    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    }
  };

  // Handle the login submission
  const handleLogin = async () => {
    if (!email || !password) {
      return; // Don't submit if fields are empty
    }

    setStatus('loading');
    const data = { email, password };

    try {
      const response = await axios.post('/user/login', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      // Store response access token in localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/main');  // Redirect to main page after successful login
      setStatus('idle');
    } catch (error) {
      // Display error message
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
      setStatus('idle');
    }
  };

  // Update debounce state when input values change
  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="main-container">
        <form>
          <div className="form-container">
            <h3>Login</h3>

            {/* Display error message if exists */}
            {error && <span className="login errors">{error}</span>}

            <div>
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  value={email}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
              {debounceState && isFieldsDirty && email === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name="password"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              {debounceState && isFieldsDirty && password === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className="submit-container">
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={() => {
                  if (status === 'loading') return; // Prevent multiple submissions
                  handleLogin();
                }}
              >
                {status === 'idle' ? 'Login' : 'Loading...'}
              </button>
            </div>

            <div className="register-container">
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
