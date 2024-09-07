import React from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';

const LK = () => {
  return(
  <Container className="d-flex justify-content-center align-items-top" style={{ minHeight: '100vh' }}>
    <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '900px' }}>
        <h2 className="text-center mb-4">Ваш личный кабинет</h2>
    </Card>
  </Container>);
};

export default LK;