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
    selectedAbiturientId: null, // Track selected row
    file: null, // Store the uploaded file
    isAdmin: false,
  };

  componentDidMount() {
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
          return;
        }
      })
      .catch((error) => {
        console.log('Error with API request', error);
      });
  }

  // Handle row click to set selectedAbiturientId
  handleRowClick = (abiturient) => {
    this.setState({
      selectedAbiturientId: abiturient.abiturient_id,
    });
  };

  // Handle file upload
  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({
      file,
    });
  };

  // Handle form submission (file upload)
  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedAbiturientId, file } = this.state;

    if (file) {
      console.log(`Uploading file for Abiturient ID ${selectedAbiturientId}:`, file);

      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('abiturient_id', selectedAbiturientId);

      // API request to upload the file (implement the backend part)
      /*
      axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('File uploaded successfully');
      })
      .catch((error) => {
        console.log('Error uploading file', error);
      });
      */
    }
  };

  // Handle form close
  handleCloseForm = () => {
    this.setState({
      selectedAbiturientId: null, // Deselect the abiturient to close the form
      file: null, // Clear file input
    });
  };

  // Handle redirect to LK page
  handleRedirect = () => {
    this.props.navigate('/lk'); // Navigate using navigate prop passed by the wrapper component
  };

  render() {
    const { profilePictureUrl, abiturients, selectedAbiturientId, isAdmin } = this.state;

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

          {!isAdmin ? (
            <div className="text-center"></div>
          ) : abiturients.length > 0 ? (
            <div className="text-center">
              <h2 className="mt-2">Панель админа</h2>
              <br></br>
              <h4 className="mt-2">Список абитуриентов</h4>
              <div className='bg-dark text-dark'>
              <div className="table-responsive">
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
                          <td colSpan="4">
                            <Form onSubmit={this.handleSubmit}>
                              <Form.Group controlId="fileUpload">
                                <Form.Label>Загрузите .csv файл</Form.Label>
                                <Form.Control
                                  type="file"
                                  accept=".csv"
                                  onChange={this.handleFileChange}
                                />
                              </Form.Group>

                              <div className="d-flex justify-content-between mt-2">
                                <Button variant="primary" type="submit" disabled={!this.state.file}>
                                  Сохранить
                                </Button>

                                <Button variant="dark" onClick={this.handleCloseForm}>
                                  Закрыть
                                </Button>
                              </div>
                            </Form>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
              </div>
              </div>
            </div>
          ) : (
            <p className="text-center">Пока нет данных для отображения.</p>
          )}
          
          <div className="text-center mt-4">
            <Button variant="secondary" onClick={this.handleRedirect}>
              Вернуться в ЛК
            </Button>
          </div>
          
        </Card>
      </Container>
    );
  }
}

AdminLK.contextType = AuthContext;

export default AdminLKWithNavigate;
