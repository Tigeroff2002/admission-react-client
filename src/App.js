import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import RegistrationForm from './Forms/RegistrationForm';
import LoginForm from './Forms/LoginForm';
import Home from './Forms/Home';
import LK from './Forms/LK';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminLK from './Forms/AdminLK';
import LKWrapper from './Forms/LK';
import AdminLKWithNavigate from './Forms/AdminLK';
import DirectionsPageWithNavigate from './Forms/DirectionsPage';
import SingleDirectionPageWithNavigate from './Forms/DirectionPage';

const HomeRoute = () => {
  const { userData } = useContext(AuthContext);
  const isAuthenticated = !!userData.token;
  return !isAuthenticated ? <Home/> : <Navigate to="/lk" />;
};

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
          <Route path='/direction/:id' element={<SingleDirectionPageWithNavigate />} />
        </Routes>
      </Container>
    </>
  );
};

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
