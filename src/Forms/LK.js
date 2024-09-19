import React, { Component } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // assuming this is where the AuthContext is defined

class LK extends Component {
  // Initialize state
  state = {
    name: '',
  };

  // Lifecycle method to handle side effects
  componentDidMount() {
    const { isAuthenticated, userData } = this.context;

    if (isAuthenticated) {
      const abiturient_id = userData['abiturient_id'];
      const token = userData['token'];

      axios
        .post('http://localhost:8000/lk', { abiturient_id, token })
        .then((response) => {
          if (response.status === 200) {
            if (response.data['result'] === true) {
              const content = response.data['content'];
              const name = `${content['first_name']} ${content['second_name']}`;
              
              // Update state with name
              this.setState({ name });
            }
          } else {
            console.log('Error occurred');
          }
        })
        .catch((error) => {
          console.log('Error with API request', error);
        });
    }
  }

  render() {
    const { name } = this.state;

    return (
      <Container className="d-flex justify-content-center align-items-top" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '900px' }}>
          <h2 className="text-center mb-4">Ваш личный кабинет, {name}</h2>
        </Card>
      </Container>
    );
  }
}

// Set contextType to use the AuthContext in a class component
LK.contextType = AuthContext;

export default LK;
