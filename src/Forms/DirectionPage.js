import React, { Component } from 'react';
import { Container, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const SingleDirectionPageWithNavigate = (props) => {
    const navigate = useNavigate();
    const { id } = useParams();
    return <DirectionsPage {...props} navigate={navigate} id={id} />;
};

class DirectionsPage extends Component {
    state = {
        directionCaption: "PRI",
        directionPlacesNumber: 10,
        directionMinBall: 50,
        places: [
            {
                "place": 1,
                "abiturient_id": 1,
                "abiturient_name": "Kirill Parakhin",
                "mark": 84,
                "admission_status": "request_in_progress",
                "prioritet_number": 1,
                "has_original_diplom": true
            },
            {
                "place": 2,
                "abiturient_id": 2,
                "abiturient_name": "Semen Bogdan",
                "mark": 82,
                "admission_status": "request_in_progress",
                "prioritet_number": 1,
                "has_original_diplom": false
            }
        ],
        isLoading: false,
        error: null,
        showModal: false
    };

    componentDidMount() {
        const { userData } = this.context;

/*         if (!userData || !userData.token) {
            window.location.href = '/';
            return;
        } */

        const abiturient_id = userData['abiturient_id'];
        const token = userData['token'];

        const request_data = {
            abiturient_id: abiturient_id,
            token: token,
            direction_id: this.props.id
        };

/*         axios
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
            }); */
    }

    toggleModal = () => {
        this.setState((prevState) => ({
            showModal: !prevState.showModal,
        }));
    };

    handleDownloadEmptyCSV = () => {
        const { places, directionCaption } = this.state;
    
        let csvContent = "data:text/csv;charset=utf-8,abiturient_id,abiturient_name,mark\n";
        
        places.forEach((place) => {
            const { abiturient_id, abiturient_name, mark } = place;
            csvContent += `${abiturient_id},${abiturient_name},${mark}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "empty_marks_" + directionCaption.toLowerCase() + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("File selected:", file.name);
        }
    };

    // Redirect back to user's LK
    handleBackToLKClick = () => {
        this.props.navigate('/lk');
    };

    render() {
        const { places, directionCaption, directionPlacesNumber, directionMinBall, isLoading, error, showModal } = this.state;

        return (
            <Container className="d-flex justify-content-center align-items-top bg-light text-dark" style={{ minHeight: '100vh' }}>
                <Card className="card p-4" style={{ maxWidth: '1200px', width: '100%', maxHeight: '900px' }}>
                    <div className="text-center">
                        <h2 className="mt-2">Направление {directionCaption}</h2>
                        <br />
                        <h3 className="mt-2">Настройки:</h3>
                        <h5 className="mt-2">Бюджетных мест {directionPlacesNumber}</h5>
                        <h5 className="mt-2">Проходной балл {directionMinBall}</h5>
                        <br />

                        <div className="d-flex justify-content-end mb-3">
                            <Button variant="primary" onClick={this.toggleModal}>
                                Управление баллами
                            </Button>
                        </div>

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
                                            <th>Место</th>
                                            <th>Id абитуриента</th>
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
                                                <td>{place.abiturient_id}</td>
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

                        <Button variant="dark" onClick={this.handleBackToLKClick} className="mt-3">
                            Вернуться в ЛК
                        </Button>

                        <Modal show={showModal} onHide={this.toggleModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Управление баллами</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="downloadEmptyMarks">
                                        <Button variant="secondary" onClick={this.handleDownloadEmptyCSV}>
                                            Скачать шаблон (пустой файл)
                                        </Button>
                                    </Form.Group>

                                    <Form.Group controlId="uploadCSV" className="mt-3">
                                        <Form.Label>Загрузить файл с баллами (CSV)</Form.Label>
                                        <Form.Control type="file" accept=".csv" onChange={this.handleFileUpload} />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={this.toggleModal}>
                                    Сохранить и закрыть
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </Card>
            </Container>
        );
    }
}

DirectionsPage.contextType = AuthContext;

export default SingleDirectionPageWithNavigate;
