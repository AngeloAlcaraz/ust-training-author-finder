import { useState } from 'react'
import { NavLink, Route, Routes } from "react-router";
// import { isMobile, BrowserView, MobileView } from 'react-device-detect';

import './App.css'
import useIsMobile from './hooks/useIsMobil';
import AuthorsPage from './pages/authorsPage';
import LoginPage from './pages/login/loginPage';
import RegisterPage from './pages/login/registerPage';
// import ResponsiveAppBar from './components/header/responsiveAppBar.component'
// import ElevateAppBar from './components/header/elevationScroll.component'

function App() {

  const isMobile = useIsMobile();

  function logout() {
    localStorage.removeItem('user')
    //  authServiceAPI.logout();
    // setCurrentUser(null);
  }

  return (
    <>
      <header className="App-header sticky-top ">
        <nav className="navbar sticky-top   navbar-expand-lg bg-body-tertiary ">
          <div className="container-fluid">
            <NavLink to="/" className="navbar-brand">Logo</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink to="/authors" className="nav-link active">Explore Authors</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/favorites" className="nav-link active">Favorites</NavLink>
                </li>
                {isMobile && (
                  <li className="nav-item dropdown ">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      User
                    </a>
                    <ul className="dropdown-menu">
                      <li><NavLink to="/register" className="nav-link active">Sign up</NavLink></li>
                      <li><NavLink to="/login" className="nav-link active">Sign in</NavLink></li>
                      <li><NavLink to="/profile" className="nav-link active">Profile</NavLink></li>
                      <li><NavLink to="/login" onClick={logout} className="nav-link active">Sign out</NavLink></li>
                    </ul>
                  </li>
                )}

              </ul>
            </div>

            {!isMobile && (
              <div className='right'>
                <NavLink to="/login" className="nav-link active">Sign in</NavLink>
                <NavLink to="/register" className="nav-link active">Sign up</NavLink>

                <NavLink to="/profile" className="nav-link active">Profile</NavLink>
                <NavLink to="/login" onClick={logout} className="nav-link active">Sign out</NavLink>
              </div>
            )}

          </div>
        </nav>
      </header>

      <div className='container'>
        <Routes>
          <Route path="/" element={<h1>Welcome to Author Finder</h1>} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/favorites" element={<h1>My Favorites</h1>} />
          <Route path="/register" element={<RegisterPage onLoginError={() => { }} onLoginSuccess={() => { }} />} />
          <Route path="/login" element={<LoginPage onLoginError={() => { }} onLoginSuccess={() => { }} />} />
          <Route path="/profile" element={<h1>User Profile</h1>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>

      </div>
    </>
  )
}

export default App
