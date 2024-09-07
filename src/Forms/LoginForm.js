import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    password: '',
  });

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const passwordInvaidMessage = 'Пароль должен содержать как минимум 8 символов, один заглавный символ и одну цифру.';

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
        if (!passwordRegex.test(value)) {
          setErrors({
            ...errors,
            password: passwordInvaidMessage,
          });
        } else {
          setErrors({
            ...errors,
            password: '',
          });
        }
    };    
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login();

    navigate('/lk');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Вход</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Войти
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginForm;