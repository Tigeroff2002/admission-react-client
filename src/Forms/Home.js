// src/pages/Home.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Card, ListGroup } from 'react-bootstrap'; // Импорт компонентов из react-bootstrap
import '../styles.css';

const Home = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="card p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="text-center mb-4">Вы не авторизованы, вам не доступен личный кабинет</h2>
        <nav>
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-transparent">
              <Link to="/register" className="text-decoration-none" style={{ color: 'var(--link-color)' }}>
                Страница регистрации
              </Link>
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent">
              <Link to="/login" className="text-decoration-none" style={{ color: 'var(--link-color)' }}>
                Страница авторизации
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </nav>
      </Card>
    </Container>
  );
};

export default Home;
