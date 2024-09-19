import React, { Component } from 'react';
import { Container, Card, Table, Image, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminLK from './AdminLK'; // Import AdminLK component

class LK extends Component {
  state = {
    name: '',
    directionsLinks: [],
    profilePictureUrl: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    isAdmin: false,
    showAdminLK: false, // New state to manage rendering of AdminLK
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
        }
        else {
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
    this.setState({ showAdminLK: true });
  };

  render() {
    const { name, directionsLinks, profilePictureUrl, isAdmin, showAdminLK } = this.state;

    // If showAdminLK is true, render the AdminLK component
    if (showAdminLK) {
      window.location.href = '/adminLK';
      return;
    }

    return (
      <Container className="d-flex justify-content-center align-items-top" style={{ minHeight: '100vh' }}>
        <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '900px' }}>
          <div className="text-center mb-4">
            <Image
              src={profilePictureUrl}
              roundedCircle
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              alt="User Profile"
            />
            <h2 className="mt-2">Ваш личный кабинет, {name}</h2>
          </div>

          {isAdmin ? (
            <div className="text-center">
              <Button variant="primary" onClick={this.handleAdminButtonClick}>
                Панель админа
              </Button>
            </div>
          ) : directionsLinks.length > 0 ? (
            <div>
            <br></br>
            <h4 className="mt-2">Список ваших направлений:</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Айди направления</th>
                  <th>Название направления</th>
                  <th>Место</th>
                  <th>Оценка</th>
                  <th>Статус</th>
                  <th>Номер приоритета</th>
                </tr>
              </thead>
              <tbody>
                {directionsLinks.map((item, index) => (
                  <tr key={index}>
                    <td>{item.direction_id}</td>
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
          ) : (
            <p className="text-center">Нет данных для отображения.</p>
          )}
        </Card>
      </Container>
    );
  }
}

LK.contextType = AuthContext;

export default LK;
