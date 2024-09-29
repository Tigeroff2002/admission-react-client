import React, { Component } from 'react';
import { Container, Card, Image, Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLKWithNavigate = (props) => {
  const navigate = useNavigate();
  return <AdminLK {...props} navigate={navigate} />;
};

class AdminLK extends Component {
  state = {
    profilePictureUrl: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    abiturients: [],
    directionsInformations: [],
    selectedAbiturientId: null,
    hasDiplomOriginal: false,
    directions: Array(3).fill({ directionId: '', prioritetNumber: '' }),
    isAdmin: false,
  };

  componentDidMount() {
    this.fetchAbiturients();
  }

  fetchAbiturients = () => {
    const { userData } = this.context;

    if (!userData || !userData.token) {
      window.location.href = '/';
      return;
    }

    const abiturient_id = userData['abiturient_id'];
    const token = userData['token'];
    const isAdmin = userData.is_admin || false;

    axios
      .post('http://localhost:8000/abiturients/all', { abiturient_id, token })
      .then((response) => {
        if (response.status === 200 && response.data['result'] === true) {
          const content = response.data['content'];

          this.setState({
            abiturients: content['abiturients'] || [],
            isAdmin: isAdmin,
          });
        } else {
          window.location.href = '/';
        }
      })
      .catch((error) => {
        console.log('Error with API request', error);
      });

      axios
      .post('http://localhost:8000/directions', { abiturient_id, token })
      .then((response) => {
        if (response.status === 200 && response.data['result'] === true) {
          const directionsInformations = response.data['content']['directions'] || [];
          this.setState({
            directionsInformations: directionsInformations,
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
      });
  };

  handleRowClick = (abiturient) => {
    this.setState((prevState) => ({
      selectedAbiturientId: prevState.selectedAbiturientId === abiturient.abiturient_id ? null : abiturient.abiturient_id,
      hasDiplomOriginal: false,
      directions: Array(3).fill({ directionId: '', prioritetNumber: '' }),
    }));
  };

  handleDiplomCheckboxChange = () => {
    this.setState((prevState) => ({
      hasDiplomOriginal: !prevState.hasDiplomOriginal,
    }));
  };

  handleDirectionChange = (index, field, value) => {
    this.setState((prevState) => {
      const directions = prevState.directions.map((direction, idx) => {
        if (idx === index) {
          return { ...direction, [field]: value };
        }
        return direction;
      });
      return { directions };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedAbiturientId, hasDiplomOriginal, directions} = this.state;
    const { userData } = this.context;

    var index = 1;

    const requestData = {
      abiturient_id: userData['abiturient_id'],
      token: userData['token'],
      content: {
        target_abiturient_id: selectedAbiturientId,
        has_diplom_original: hasDiplomOriginal,
        directions_links: directions.map((dir) => ({
          direction_id: dir.directionId,
          prioritet_number: index++,
          mark: 0,
        })),
      },
    };

    axios.post('http://localhost:8000/abiturients/addInfo', requestData)
      .then((response) => {
        if (response.status === 200 && response.data['result'] === true) {
          this.fetchAbiturients();
        } else {
          console.log('Failed to add information');
        }
      })
      .catch((error) => {
        console.log('Error submitting data', error);
      });
  };

  handleCloseForm = () => {
    this.setState({
      selectedAbiturientId: null,
    });
  };

  handleRedirect = () => {
    this.props.navigate('/lk');
  };

  render() {
    const { profilePictureUrl, abiturients, selectedAbiturientId, isAdmin, directions, hasDiplomOriginal, directionsInformations } = this.state;

    return (
      <Container className="d-flex justify-content-center align-items-top bg-dark text-dark" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '1200px' }}>
          <div className="text-center mb-4 bg-dark text-dark">
            <Image
              src={profilePictureUrl}
              roundedCircle
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              alt="User Profile"
            />
          </div>

          {!isAdmin ? (
            <div className="text-center"></div>
          ) : abiturients.length > 0 ? (
            <div className="text-center">
              <h3 className="mt-2">Список абитуриентов</h3>
              <br />
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Имя абитуриента</th>
                    <th>Подавал доки?</th>
                    <th>Уже зачислен?</th>
                  </tr>
                </thead>
                <tbody>
                  {abiturients.map((item) => (
                    <React.Fragment key={item.abiturient_id}>
                      <tr onClick={() => this.handleRowClick(item)}>
                        <td>{item.abiturient_name}</td>
                        <td>{item.is_requested ? 'Да' : 'Нет'}</td>
                        <td>{item.is_enrolled ? 'Да' : 'Нет'}</td>
                      </tr>
                      {selectedAbiturientId === item.abiturient_id && (
                        <tr>
                          <td colSpan="3">
                            <Form onSubmit={this.handleSubmit}>
                              <Form.Group controlId="hasDiplomOriginal" className="mb-2">
                                <Form.Check
                                  type="checkbox"
                                  label="Есть оригинал диплома?"
                                  checked={hasDiplomOriginal}
                                  onChange={this.handleDiplomCheckboxChange}
                                />
                              </Form.Group>
                              
                              {!item.is_requested && directions.map((direction, index) => {

                                const matchingDirection = directionsInformations.find(info => info.direction_id === direction.directionId);

                                return (
                                  <div key={index} className="mb-2">
                                    <Form.Group controlId={`direction${index}`}>
                                      <Form.Label className="mb-1">
                                        {matchingDirection
                                          ? `Направление ${index + 1}: ${matchingDirection.direction_caption}`
                                          : `Направление ${index + 1}: Нет данных`}
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="ID направления"
                                        value={direction.directionId}
                                        onChange={(e) => this.handleDirectionChange(index, 'directionId', e.target.value)}
                                        className="mb-1"
                                      />
                                      <Form.Label className="mb-1">Номер приоритета: {index + 1}</Form.Label>
                                    </Form.Group>
                                  </div>
                                );
                              })}

                              <Button variant="dark" type="submit" className="mt-2">
                                Сохранить
                              </Button>
                            </Form>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
              <Button variant="dark" onClick={this.handleRedirect}>
                Вернуться в ЛК
              </Button>
            </div>
          ) : (
            <p className="text-center">Пока нет данных для отображения.</p>
          )}
          
        </Card>
      </Container>
    );
  }
}

AdminLK.contextType = AuthContext;

export default AdminLKWithNavigate;
