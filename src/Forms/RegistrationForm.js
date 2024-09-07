import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      secondName: '',
      email: '',
      password: '',
    });

    const [errors, setErrors] = useState({
        password: '',
      });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const passwordInvaidMessage = 'Пароль должен содержать как минимум 8 символов, один заглавный символ и одну цифру.';

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

      if (!passwordRegex.test(formData.password)) {
        setErrors({
          ...errors,
          password: passwordInvaidMessage,
        });

        alert(passwordInvaidMessage);

        return;
      }
      navigate('/lk');
    };
  
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Регистрация</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstname">
              <Form.Label>Ваше имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите ваше имя"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSecondname">
              <Form.Label>Ваша фамилия</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите вашу фамилию"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
                required
              />
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Введите вашу почту"
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
                placeholder="Введите новый пароль"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </Form.Group>
  
            <Button variant="primary" type="submit" className="w-100">
              Зарегистрироваться
            </Button>
          </Form>
        </Card>
      </Container>
    );
  };
  
  export default RegistrationForm;
