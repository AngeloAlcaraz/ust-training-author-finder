import { NavLink, Route, Routes, useNavigate } from "react-router";
// import { isMobile, BrowserView, MobileView } from 'react-device-detect';

import './App.css'
import useIsMobile from './hooks/useIsMobil';
import AuthorsPage from './pages/authorsPage';
import LoginPage from './pages/login/loginPage';
import RegisterPage from './pages/login/registerPage';
import type { IAuth } from "./Auth/iauth";
import { useEffect, useState } from "react";
import { authServiceAPI } from "./services/auth.service";
import AuthorPage from "./pages/authorPage";
import HomePage from "./pages/homePage";

function App() {

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<IAuth | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('Component has mounted! Fetching data...');
    const user = authServiceAPI.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
    else {
      console.log('No user found in local storage.');
    }
  }, []);

  const handleLoginSuccess = (auth: IAuth) => {
    setUserToken(auth.data.accessToken);
    // setAppError(null); // Clear any previous app-level errors
    setCurrentUser(auth);
    console.log('Login successful! Token:', userToken);

    navigate("/authors");
    window.location.reload();
    // Redirect or perform other actions after login
  };

  const handleLoginError = (error: string) => {
    setUserToken(null);
    // setAppError(`Login failed: ${error}`);
    console.error('Login failed:', error);
  };

  function logout() {
    localStorage.removeItem('user')
    //  authServiceAPI.logout();
    // setCurrentUser(null);
  }

  function handleAddFavorite(author: any) {
    console.log("Adding author to favorites:", author);
    // Implement the logic to add the author to favorites
    // This could involve calling an API or updating local state
  }


  return (
    <div className="container">
      <header className="App-header sticky-top ">
        <nav className="navbar sticky-top   navbar-expand-lg bg-body-tertiary ">
          <div className="container-fluid">
            <NavLink to="/" className="navbar-brand">Logo</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                {currentUser && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/authors" className="nav-link active">Explore Authors</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/favorites" className="nav-link active">Favorites</NavLink>
                    </li>
                  </>
                )}

                {isMobile && (
                  <li className="nav-item dropdown ">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      User
                    </a>
                    <ul className="dropdown-menu">
                      {currentUser ? (
                        <>
                          {/* <li><NavLink to="/profile" className="nav-link active">Profile</NavLink></li> */}
                          <li><NavLink to="/login" onClick={logout} className="nav-link active">Sign out</NavLink></li>
                        </>
                      ) : (
                        <>
                          <li><NavLink to="/register" className="nav-link active">Sign up</NavLink></li>
                          <li><NavLink to="/login" className="nav-link active">Sign in</NavLink></li>
                        </>
                      )}
                    </ul>
                  </li>
                )}

              </ul>
            </div>

            {!isMobile && (
              <div className='right'>
                {currentUser ? (
                  <>
                    {/* <NavLink to="/profile" className="nav-link active">Profile</NavLink> */}
                    <NavLink to="/login" onClick={logout} className="nav-link active">Sign out</NavLink>
                  </>

                ) : (
                  <>
                    <NavLink to="/login" className="nav-link active">Sign in</NavLink>
                    <NavLink to="/register" className="nav-link active">Sign up</NavLink>
                  </>
                )
                }
              </div>
            )}

          </div>
        </nav>
      </header>

      <div className='container'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/authors" element={<AuthorsPage onAddFavorite={handleAddFavorite} />} />
          <Route path="/authors/:authorId" element={<AuthorPage onAddFavorite={handleAddFavorite} />} />
          <Route path="/favorites" element={<h1>My Favorites</h1>} />
          <Route path="/register" element={<RegisterPage onLoginError={handleLoginError} onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/login" element={<LoginPage onLoginError={handleLoginError} onLoginSuccess={handleLoginSuccess} />} />
          {/* <Route path="/profile" element={<h1>User Profile</h1>} /> */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>

      </div>

      <footer className="App-footer">
        <p>&copy; 2025 AuthorFinder. All rights reserved.</p>
      </footer>
    </div >
  )
}

export default App
