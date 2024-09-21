import React, { Component } from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const DirectionsPageWithNavigate = (props) => {
    const navigate = useNavigate();

    const { id } = useParams();

    return <DirectionsPage {...props} navigate={navigate} id={id} />;
};

class DirectionsPage extends Component {
    state = {
        directionCaption: null,
        directionPlacesNumber : 0,
        directionMinBall: 0,
        places: [],
        isLoading: true, // to show loading state
        error: null, // to handle error state
    };

    componentDidMount() {
        const { userData } = this.context;

        if (!userData || !userData.token) {
            window.location.href = '/';
            return;
        }

        const abiturient_id = userData['abiturient_id'];
        const token = userData['token'];

        const request_data = {
            abiturient_id: abiturient_id,
            token: token,
            direction_id: this.props.id
        }

        axios
            .post('http://localhost:8000/direction', request_data)
            .then((response) => {
                if (response.status === 200 && response.data['result'] === true) {
                    const directionCaption = response.data['content']['direction_caption'];
                    const directionPlacesNumber = response.data['content']['budget_places_number'];
                    const directionMinBall = response.data['content']['min_ball'];
                    const places = response.data['content']['places'] || [];
                    this.setState({
                        directionCaption: directionCaption,
                        directionPlacesNumber: directionPlacesNumber,
                        directionMinBall: directionMinBall,
                        places: places,
                        isLoading: false,
                    });
                } else {
                    this.setState({
                        error: response.data.failure_message || 'Failed to load places',
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
    }

    // Redirect back to user's LK
    handleBackToLKClick = () => {
        this.props.navigate('/lk');
    };

    render() {
        const { places, directionCaption, directionPlacesNumber, directionMinBall, isLoading, error } = this.state;

        return (
            <Container className="d-flex justify-content-center align-items-top bg-light text-dark" style={{ minHeight: '100vh' }}>
                <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '900px' }}>
                    <div className="text-center">
                        <h2 className="mt-2">Направление {directionCaption}</h2>
                        <br></br>
                        <h3 className="mt-2">Настройки:</h3>
                        <h5 className="mt-2">Бюджетных мест {directionPlacesNumber}</h5>
                        <h5 className="mt-2">Проходной балл {directionMinBall}</h5>
                        <br></br>
                        <h3 className="mt-2">Список мест направления</h3>
                        <br />

                        {isLoading ? (
                            <p>Загрузка...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : places.length > 0 ? (
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Номер</th>
                                            <th>Абитуриент</th>
                                            <th>Оценка</th>
                                            <th>Статус зачисления</th>
                                            <th>Приоритет</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {places.map((place) => (
                                            <tr key={place.place}>
                                                <td>{place.place}</td>
                                                <td>{place.abiturient_name}</td>
                                                <td>{place.mark}</td>
                                                <td>{place.admission_status}</td>
                                                <td>{place.prioritet_number}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <p>Нет данных для отображения.</p>
                        )}

                        {/* Button to return back to LK */}
                        <Button variant="dark" onClick={this.handleBackToLKClick} className="mt-3">
                            Вернуться в ЛК
                        </Button>
                    </div>
                </Card>
            </Container>
        );
    }
}

DirectionsPage.contextType = AuthContext; // Accessing AuthContext for user data

export default DirectionsPageWithNavigate;
