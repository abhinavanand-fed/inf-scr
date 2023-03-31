import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiEndpoint = 'https://randomuser.me/api/?results=500';

function App() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      axios.get(apiEndpoint).then((response) => {
        setUserList([...userList, ...response.data.results]);
        setIsLoading(false);
      });
    }, 1000);
  };

  useEffect(() => {
    // check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(isLoggedIn);
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    if (username === 'foo' && password === 'bar') {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <ul style={{ listStyle: 'none' }}>
            {userList.map((user, index) => (
              <li key={index}>
                <img src={user.picture.thumbnail} alt={user.name.first} />
                <span>{user.name.first} {user.name.last}</span>
              </li>
            ))}
            {isLoading && <li>Loading...</li>}
          </ul>
          {!isLoading && (
            <button onClick={loadMore}>
              Load more
            </button>
          )}
        </div>
      ) : (
        <div>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" name="username" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
