import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RegistrationFormWrapper = () => {
  const navigate = useNavigate();
  return <RegistrationForm navigate={navigate} />;
};

class RegistrationForm extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: '',
        secondName: '',
        email: '',
        password: '',
        is_admin: false, // Add is_admin to formData
      },
      errors: {
        firstName: '',
        secondName: '',
        email: '',
        password: '',
      },
    };

    this.passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    this.passwordInvalidMessage = 'Пароль должен содержать как минимум 8 символов, один заглавный символ и одну цифру.';
    this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalidMessage = 'Введите корректный email';
    this.requiredFieldMessage = 'Это поле не может быть пустым';
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: type === 'checkbox' ? checked : value, // Handle checkbox input
      },
    }));

    if (name === 'password') {
      if (!this.passwordRegex.test(value)) {
        this.setState({
          errors: {
            ...this.state.errors,
            password: this.passwordInvalidMessage,
          },
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            password: '',
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
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            email: '',
          },
        });
      }
    } else if (name === 'firstName' || name === 'secondName') {
      if (value.trim() === '') {
        this.setState({
          errors: {
            ...this.state.errors,
            [name]: this.requiredFieldMessage,
          },
        });
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            [name]: '',
          },
        });
      }
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, secondName, email, password, is_admin } = this.state.formData;
    let isValid = true;

    if (!this.passwordRegex.test(password)) {
      this.setState({
        errors: {
          ...this.state.errors,
          password: this.passwordInvalidMessage,
        },
      });
      isValid = false;
    }

    if (!this.emailRegex.test(email)) {
      this.setState({
        errors: {
          ...this.state.errors,
          email: this.emailInvalidMessage,
        },
      });
      isValid = false;
    }

    if (firstName.trim() === '') {
      this.setState({
        errors: {
          ...this.state.errors,
          firstName: this.requiredFieldMessage,
        },
      });
      isValid = false;
    }

    if (secondName.trim() === '') {
      this.setState({
        errors: {
          ...this.state.errors,
          secondName: this.requiredFieldMessage,
        },
      });
      isValid = false;
    }

    if (!isValid) {
      alert('Пожалуйста, исправьте ошибки в форме.');
      return;
    }

    const { login } = this.context; // Access login function from AuthContext
    const { navigate } = this.props; // Get navigate from props

    const first_name = firstName;
    const second_name = secondName;

    axios
      .post('http://localhost:8000/register', { email, password, first_name, second_name, is_admin })
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
                firstName: { borderColor: 'red', color: 'red' },
                secondName: { borderColor: 'red', color: 'red' },
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
            firstName: { borderColor: 'red', color: 'red' },
            secondName: { borderColor: 'red', color: 'red' },
          },
        });
      });
  };

  render() {
    const { formData, errors } = this.state;

    return (
      <Container className="d-flex justify-content-center align-items-center bg-dark text-dark" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Регистрация</h2>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstname">
              <Form.Label>Ваше имя</Form.Label>
              <Form.Control
                type="text"
                placeholder={errors.firstName || "Введите ваше имя"}
                name="firstName"
                value={formData.firstName}
                onChange={this.handleChange}
                style={{ borderColor: errors.firstName ? 'red' : undefined, borderWidth: errors.firstName ? '2px' : undefined }}
                required
              />
              {errors.firstName && <Form.Text className="text-danger">{errors.firstName}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSecondname">
              <Form.Label>Ваша фамилия</Form.Label>
              <Form.Control
                type="text"
                placeholder={errors.secondName || "Введите вашу фамилию"}
                name="secondName"
                value={formData.secondName}
                onChange={this.handleChange}
                style={{ borderColor: errors.secondName ? 'red' : undefined, borderWidth: errors.secondName ? '2px' : undefined }}
                required
              />
              {errors.secondName && <Form.Text className="text-danger">{errors.secondName}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder={errors.email || "Введите вашу почту"}
                name="email"
                value={formData.email}
                onChange={this.handleChange}
                style={{ borderColor: errors.email ? 'red' : undefined, borderWidth: errors.email ? '2px' : undefined }}
                required
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder={errors.password || "Введите новый пароль"}
                name="password"
                value={formData.password}
                onChange={this.handleChange}
                style={{ borderColor: errors.password ? 'red' : undefined, borderWidth: errors.password ? '2px' : undefined }}
                required
              />
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIsAdmin">
              <Form.Check
                type="checkbox"
                label="Вы админ?"
                name="is_admin"
                checked={formData.is_admin}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Зарегистрироваться
            </Button>
          </Form>
        </Card>
      </Container>
    );
  }
}

export default RegistrationFormWrapper;
