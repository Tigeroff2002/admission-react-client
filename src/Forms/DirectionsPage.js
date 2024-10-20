import React, { Component } from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DirectionsPageWithNavigate = (props) => {
    const navigate = useNavigate();
    return <DirectionsPage {...props} navigate={navigate} />;
  };

class DirectionsPage extends Component {
  state = {
    directions: [
      {
          "direction_id": 1,
          "direction_caption": "PRI"
      },
      {
          "direction_id": 2,
          "direction_caption": "IST"
      }
  ],
    //isLoading: true,
    isLoading: false,
    error: null
  };

  componentDidMount() {
    const { userData } = this.context;

/*     if (!userData || !userData.token) {
      window.location.href = '/';
      return;
    } */

    const abiturient_id = userData['abiturient_id'];
    const token = userData['token'];

/*     axios
      .post('http://localhost:8000/directions', { abiturient_id, token })
      .then((response) => {
        if (response.status === 200 && response.data['result'] === true) {
          const directions = response.data['content']['directions'] || [];
          this.setState({
            directions: directions,
            isLoading: false,
          });
        } else {
          this.setState({
            error: response.data.failure_message || 'Failed to load directions',
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: 'Error with API request',
          isLoading: false,
        });
        console.log('Error with API request', error);
      }); */
  }

  handleBackToLKClick = () => {
    this.props.navigate('/lk');
  };

  handleRowClick = (direction_id) => {
    this.props.navigate(`/direction/${1}`);
  };

  render() {
    const { directions, isLoading, error } = this.state;

    return (
      <Container className="d-flex justify-content-center align-items-top bg-light text-dark" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '900px' }}>
          <div className="text-center">
            <h2 className="mt-2">Список направлений</h2>
            <br />

            {isLoading ? (
              <p>Загрузка...</p>
            ) : error ? (
              <p>{error}</p>
            ) : directions.length > 0 ? (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID направления</th>
                      <th>Название направления</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directions.map((direction) => (
                      <tr key={direction.direction_id} onClick={() => this.handleRowClick(direction.direction_id)} style={{ cursor: 'pointer' }}>
                        <td>{direction.direction_id}</td>
                        <td>{direction.direction_caption}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p>Нет данных для отображения.</p>
            )}

            <Button variant="dark" onClick={this.handleBackToLKClick} className="mt-3">
              Вернуться в ЛК
            </Button>
          </div>
        </Card>
      </Container>
    );
  }
}

DirectionsPage.contextType = AuthContext;

export default DirectionsPageWithNavigate;
