import { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../UserContext';
import { Redirect } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerError, setRegisterError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const user = useContext(UserContext);

  function registerUser(e) {
    e.preventDefault();

    const data = { email, password };
    axios
      .post('http://localhost:4000/register', data, {
        withCredentials: true,
      })
      .then((response) => {
        user.setEmail(response.data.email);
        setEmail('');
        setPassword('');
        setRegisterError(false);
        setRedirect(true);
      })
      .catch(() => {
        setRegisterError(true);
      });
  }

  if (redirect) {
    return <Redirect to={'/'} />;
  }

  return (
    <div className="background-container">
      <div className="form-container">
        <form action="" onSubmit={(e) => registerUser(e)}>
          {registerError && <div>This email already exists!</div>}
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
