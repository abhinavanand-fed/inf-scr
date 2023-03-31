import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const apiEndpoint = 'https://randomuser.me/api/?results=500';

function App() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(isLoggedIn);

    // fetch user data if logged in
    if (isLoggedIn) {
      setIsLoading(true);
      fetchUsers(1);
    }
  }, []);

  const fetchUsers = (pageNumber) => {
    setIsLoading(true);
    axios.get(`${apiEndpoint}&page=${pageNumber}`).then((response) => {
      setUserList([...userList, ...response.data.results]);
      setIsLoading(false);
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    if (username === 'foo' && password === 'bar') {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      fetchUsers(1);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setPage(page + 1);
        fetchUsers(page + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div className="app">
      {isLoggedIn ? (
        <div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <ul className="user-list">
            {userList.map((user, index) => (
              <li key={index} className="user-item">
                <img className="user-avatar" src={user.picture.thumbnail} alt={user.name.first} />
                <span className="user-name">{user.name.first} {user.name.last}</span>
              </li>
            ))}
            {isLoading && <li>Loading...</li>}
          </ul>
        </div>
      ) : (
        <div>
          <form onSubmit={handleLogin}>
            <input className="input-field" type="text" placeholder="Username" name="username" />
            <input className="input-field" type="password" placeholder="Password" name="password" />
            <button className="login-btn" type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
