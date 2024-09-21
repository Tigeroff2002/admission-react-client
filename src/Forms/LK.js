import React, { Component } from 'react';
import { Container, Card, Table, Image, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LKWrapper = (props) => {
  const navigate = useNavigate();

  return <LK {...props} navigate={navigate} />;
};

class LK extends Component {
  state = {
    name: '',
    directionsLinks: [],
    profilePictureUrl: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    isAdmin: false,
    showAdminLK: false,
    showDirectionForm: false, // State to manage form visibility
    directionName: '',
    budgetPlaces: '',
    minBall: '',
    formError: ''
  };

  componentDidMount() {
    const { userData } = this.context;

    if (!userData || !userData.token) {
      window.location.href = '/';
      return;
    }

    const isAdmin = userData.is_admin || false;
    const abiturient_id = userData['abiturient_id'];
    const token = userData['token'];

    axios
      .post('http://localhost:8000/lk', { abiturient_id, token })
      .then((response) => {
        if (response.status === 200 && response.data['result'] === true) {
          const content = response.data['content'];
          const name = `${content['first_name']} ${content['second_name']}`;

          this.setState({
            name,
            directionsLinks: content['directions_links'] || [],
            isAdmin: isAdmin,
          });
        } else {
          window.location.href = '/';
          return;
        }
      })
      .catch((error) => {
        console.log('Error with API request', error);
      });
  }

  // Function to handle admin button click
  handleAdminButtonClick = () => {
    this.props.navigate('/adminLK');
  };

  // Handle input changes for the new direction form
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, formError: '' });
  };

  // Handle submission of the new direction form
  handleSubmitDirection = (e) => {
    e.preventDefault();
    const { directionName, budgetPlaces, minBall } = this.state;

    // Validation
    if (!directionName) {
      this.setState({ formError: 'Direction name is required' });
      return;
    }
    if (!Number.isInteger(+budgetPlaces) || budgetPlaces < 4 || budgetPlaces > 20) {
      this.setState({ formError: 'Budget places must be a natural number between 4 and 20' });
      return;
    }
    if (!Number.isInteger(+minBall) || minBall < 40 || minBall > 80) {
      this.setState({ formError: 'Min ball must be a natural number between 40 and 80' });
      return;
    }

    const { userData } = this.context;
    const abiturient_id = userData['abiturient_id'];
    const token = userData['token'];

    const requestData = {
      direction_caption: directionName,
      budget_places_number: budgetPlaces,
      min_ball: minBall,
      abiturient_id,
      token,
    };

    axios.post('http://localhost:8000/directions/addNew', requestData)
      .then((response) => {
        if (response.status === 200 && response.data['result'] === true) {
          const directionId = response.data['direction_id'];
          this.props.navigate(`/direction/${directionId}`); // Redirect to new direction page
        } else {
          this.setState({ formError: response.data.failure_message || 'Failed to add new direction' });
        }
      })
      .catch((error) => {
        console.log('Error with API request', error);
        this.setState({ formError: 'Error with API request' });
      });
  };

  // Toggle the visibility of the direction form
  toggleDirectionForm = () => {
    this.setState((prevState) => ({ showDirectionForm: !prevState.showDirectionForm }));
  };

  render() {
    const { name, directionsLinks, profilePictureUrl, isAdmin, formError, showDirectionForm } = this.state;

    return (
      <Container className="d-flex justify-content-center align-items-top bg-dark text-dark" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '900px' }}>
          <div className="text-center mb-4 bg-dark text-dark">
            <Image
              src={profilePictureUrl}
              roundedCircle
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              alt="User Profile"
            />
          </div>
          {isAdmin ? (
            <div className="text-center">
              <h2 className="mt-2">Кабинет администратора {name}</h2>
              <br />
              <Button variant="dark" onClick={this.handleAdminButtonClick}>
                Панель абитуриентов
              </Button>
              <br />
              <br />
              {/* Button to show/hide the direction form */}
              <Button variant="dark" className="mt-3" onClick={this.toggleDirectionForm}>
                {showDirectionForm ? 'Скрыть форму' : 'Добавить новое направление'}
              </Button>

              {showDirectionForm && (
                <div className="mt-4">
                  {formError && <p className="text-danger">{formError}</p>}
                  <Form onSubmit={this.handleSubmitDirection}>
                    <Form.Group controlId="directionName">
                      <Form.Label>Название направления</Form.Label>
                      <Form.Control
                        type="text"
                        name="directionName"
                        onChange={this.handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="budgetPlaces">
                      <Form.Label>Количество бюджетных мест</Form.Label>
                      <Form.Control
                        type="number"
                        name="budgetPlaces"
                        onChange={this.handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="minBall">
                      <Form.Label>Минимальный балл</Form.Label>
                      <Form.Control
                        type="number"
                        name="minBall"
                        onChange={this.handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Button variant="dark" type="submit" className="mt-3">
                      Добавить направление
                    </Button>
                  </Form>
                </div>
              )}
            </div>
          ) : directionsLinks.length > 0 ? (
            <div className='bg-light text-dark'>
              <h2 className="mt-2">Ваш личный кабинет, {name}</h2>
              <br />
              <h4 className="mt-2">Список ваших направлений:</h4>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Направление</th>
                      <th>Место</th>
                      <th>Оценка</th>
                      <th>Статус</th>
                      <th>Номер приоритета</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directionsLinks.map((item, index) => (
                      <tr key={index}>
                        <td>{item.direction_caption}</td>
                        <td>{item.place}</td>
                        <td>{item.mark}</td>
                        <td>{item.admission_status}</td>
                        <td>{item.priotitet_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <br />
            </div>
          ) : (
            <div className='bg-light text-dark'>
            <h2 className="mt-2">Ваш личный кабинет, {name}</h2>
            <br></br>
            <p className="text-center">Пока нет данных для отображения.</p>
            </div>
          )}
        </Card>
      </Container>
    );
  }
}

LK.contextType = AuthContext;

export default LKWrapper;
