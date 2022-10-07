import './App.css';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Register from './Views/Register';
import UserContext from './UserContext';
import axios from 'axios';
import Login from './Views/Login';
import Home from './Views/Home';
import logo from './Images/logo.png';

function App() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:4000/user', { withCredentials: true })
      .then((response) => {
        setEmail(response.data.email);
      });
  }, []);

  function logout() {
    axios
      .post('http://localhost:4000/logout', {}, { withCredentials: true })
      .then(() => setEmail(''));
  }

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      <BrowserRouter>
        <nav>
          {!email && (
            <>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </>
          )}
          {!!email && (
            <>
              <img className={'nav-logo'} src={logo} alt={'logo'} />

              <a
                href="!#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Logout
              </a>
            </>
          )}
        </nav>

        <main>
          <Switch>
            <Route exact path={'/'} component={Home} />
            <Route exact path={'/register'} component={Register} />
            <Route exact path={'/login'} component={Login} />
          </Switch>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
