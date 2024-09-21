import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import RegistrationForm from './Forms/RegistrationForm';
import LoginForm from './Forms/LoginForm';
import Home from './Forms/Home';
import LK from './Forms/LK';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminLK from './Forms/AdminLK';
import DirectionsPage from './Forms/DirectionsPage';
import DirectionPage from './Forms/DirectionPage';
import LKWrapper from './Forms/LK';
import AdminLKWithNavigate from './Forms/AdminLK';
import DirectionsPageWithNavigate from './Forms/DirectionPage';

// HomeRoute component to redirect based on authentication status
const HomeRoute = () => {
  const { userData } = useContext(AuthContext);
  const isAuthenticated = !!userData.token; // Assuming token is present when authenticated
  return !isAuthenticated ? <Home/> : <Navigate to="/lk" />;
};

// AppContent component contains the navigation and routes
const AppContent = () => {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAllDirections = () => {
    navigate('/directions');
  }

  const handleLK = () => {
    navigate('/lk');
  }

  const { userData } = useContext(AuthContext);
  const isAuthenticated = !!userData.token;

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">Домашняя страница</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            {
              isAuthenticated ? (
                <>
              <Nav.Link onClick={handleLogout}>Выйти из системы</Nav.Link>
              <Nav.Link onClick={handleAllDirections}>Все направления</Nav.Link>
              <Nav.Link onClick={handleLK}>Ваш ЛК</Nav.Link>
              </>
            ) : (
              <>
              <Nav.Link as={Link} to="/register">Страница регистрации</Nav.Link>
              <Nav.Link as={Link} to="/login">Страница авторизации</Nav.Link>
              </>
            )
          }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/lk" element={<LKWrapper />} />
          <Route path="/adminLK" element={<AdminLKWithNavigate />} />
          <Route path='/directions' element={<DirectionsPageWithNavigate />} />
          <Route path='/direction/:id' element={<DirectionsPageWithNavigate />} />
        </Routes>
      </Container>
    </>
  );
};

// Main App component with Router and AuthProvider
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
