import React, { Component } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

import axios from 'axios';

// Functional wrapper component to use useNavigate hook
const LoginFormWrapper = () => {
  const navigate = useNavigate();

  return <LoginForm navigate={navigate} />;
};

class LoginForm extends Component {
  static contextType = AuthContext; // Set contextType to use AuthContext

  constructor(props) {
    super(props);
    this.initialState = {
      formData: {
        email: '',
        password: '',
      },
      errors: {
        email: '',
        password: '',
      },
      errorMessages: {
        email: '',
        password: '',
      },
      inputStyles: {
        email: {},
        password: {},
      },
    };

    this.state = { ...this.initialState };

    this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
    this.passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // Regex for password validation
    this.passwordInvalidMessage = 'Пароль должен содержать как минимум 8 символов, один заглавный символ и одну цифру.';
    this.emailInvalidMessage = 'Введите корректный email';
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));

    if (name === 'password') {
      if (!this.passwordRegex.test(value)) {
        this.setState({
          errors: {
            ...this.state.errors,
            password: this.passwordInvalidMessage,
          },
          errorMessages: {
            ...this.state.errorMessages,
            password: this.passwordInvalidMessage,
          },
          inputStyles: {
            ...this.state.inputStyles,
            password: { borderColor: 'red', color: 'red' },
          },
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            password: '',
          },
          errorMessages: {
            ...this.state.errorMessages,
            password: '',
          },
          inputStyles: {
            ...this.state.inputStyles,
            password: {},
          },
        });
      }
    } else if (name === 'email') {
      if (!this.emailRegex.test(value)) {
        this.setState({
          errors: {
            ...this.state.errors,
            email: this.emailInvalidMessage,
          },
          errorMessages: {
            ...this.state.errorMessages,
            email: this.emailInvalidMessage,
          },
          inputStyles: {
            ...this.state.inputStyles,
            email: { borderColor: 'red', color: 'red' },
          },
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            email: '',
          },
          errorMessages: {
            ...this.state.errorMessages,
            email: '',
          },
          inputStyles: {
            ...this.state.inputStyles,
            email: {},
          },
        });
      }
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = this.state.formData;
    const { login } = this.context; // Access login function from AuthContext
    const { navigate } = this.props; // Get navigate from props

    axios
      .post('http://localhost:8000/login', { email, password })
      .then((response) => {
        if (response.status === 200) {
          if (response.data['result'] === true) {
            const { abiturient_id, token, is_admin } = response.data;
            const obj = { abiturient_id, token, is_admin };

            login(obj); // Call login function

            navigate('/lk'); // Navigate to '/lk'
          } else {
            // Update error messages and styles on login failure
            this.setState({
              errorMessages: {
                email: 'Invalid email or password',
                password: 'Invalid email or password',
              },
              inputStyles: {
                email: { borderColor: 'red', color: 'red' },
                password: { borderColor: 'red', color: 'red' },
              },
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error with API request', error);
        // Optionally update error messages and styles on error
        this.setState({
          errorMessages: {
            email: 'An error occurred',
            password: 'An error occurred',
          },
          inputStyles: {
            email: { borderColor: 'red', color: 'red' },
            password: { borderColor: 'red', color: 'red' },
          },
        });
      });
  };

  render() {
    const { email, password } = this.state.formData;
    const { email: emailError, password: passwordError } = this.state.errorMessages;
    const { email: emailStyle, password: passwordStyle } = this.state.inputStyles;

    return (
      <Container className="d-flex justify-content-center align-items-center bg-dark text-dark" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Вход</h2>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Почта</Form.Label>
              <Form.Control
                type="email"
                placeholder={emailError || "Введите почту"}
                name="email"
                value={email}
                onChange={this.handleChange}
                style={emailStyle}
                required
              />
              {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder={passwordError || "Введите пароль"}
                name="password"
                value={password}
                onChange={this.handleChange}
                style={passwordStyle}
                required
              />
              {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Войти
            </Button>
          </Form>
        </Card>
      </Container>
    );
  }
}

export default LoginFormWrapper;
