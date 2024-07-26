import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BarcodeScanner } from './BarcodeScanner.jsx'; // Ensure correct path

const Dashboard = () => {
    const [id, setId] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const token = localStorage.getItem('token');

    const checkIngresoTurno = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}bitacora-events/ingreso/${user.id}`, config);
            if (response.data.exists) {
                setId(response.data.locationId); // Set the locationId if the event exists
            }
            return response.data.exists;
        } catch (error) {
            console.error('Error checking ingreso de turno:', error);
            Swal.fire('Error', 'Error checking ingreso de turno', 'error');
            return false;
        }
    };

    const fetchData = async () => {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const ingresoExists = await checkIngresoTurno();
            if (ingresoExists) {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}events`, config);
                const data = response.data;
                setEvents(data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            Swal.fire('Error', 'Error fetching events', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.roleId == 2) {
            fetchData();
        }
    }, []);

    const handleScanResult = async (result) => {
        if (result) {
            const nowdate = new Date().toISOString(); // Get current date and time in ISO format
            const dataToSend = {
                nameForm: "ingreso de turno",
                activities: [
                    {
                        type: "datetime",
                        label: "hora y fecha de ingreso",
                        value: nowdate
                    }
                ],
                userId: user.id,
                locationId: result
            };

            const url = `${import.meta.env.VITE_BASE_URL}bitacora-events`;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                await axios.post(url, dataToSend, config);
                console.log('Event created successfully');
                Swal.fire('Success', 'Ingreso de turno registrado', 'success');
                fetchData();
            } catch (error) {
                console.error('Error creating event:', error);
                Swal.fire('Error', 'Error en el ingreso de turno', 'error');
            }
        }
        setShowScanner(false); // Hide scanner after scanning
    };

    const handleEndShift = async () => {
        const nowdate = new Date().toISOString();
        const dataToSend = {
            nameForm: "fin de turno",
            activities: [
                {
                    type: "datetime",
                    label: "hora y fecha de fin de turno",
                    value: nowdate
                }
            ],
            userId: user.id,
            locationId: id
        };

        const url = `${import.meta.env.VITE_BASE_URL}bitacora-events`;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            await axios.post(url, dataToSend, config);
            console.log('Shift ended successfully');
            Swal.fire('Success', 'Turno finalizado', 'success');
            fetchData();
        } catch (error) {
            console.error('Error ending shift:', error);
            Swal.fire('Error', 'Error al finalizar el turno', 'error');
        }
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <div style={{ textAlign: 'center' }}>
            {user.roleId === 2 ? (
                <>
                    <h1>¿Qué deseas hacer? {user.name}</h1>
                    {id && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            {events.map((event) => {
                                if (event.name !== 'Ingreso Jornada') {
                                    return (
                                        <Button 
                                            key={event.id} 
                                            type="primary" 
                                            style={{ width: '200px', height: '40px' }}
                                            onClick={() => {
                                                if (!id || isNaN(Number(id))) {
                                                    console.log('Error: ID is invalid');
                                                    navigate('/error');
                                                } else {
                                                    const url = `/location/${id}/form/${event.id}`;
                                                    console.log(`Navigating to: ${url}`);
                                                    navigate(url);
                                                }
                                            }}
                                        >
                                            {event.name}
                                        </Button>
                                    );
                                }
                                return null;
                            })}
                            <Button 
                                type="default" 
                                style={{ width: '200px', height: '40px' }}
                                onClick={handleEndShift}
                            >
                                Terminar Turno
                            </Button>
                        </div>
                    )}
                    {showScanner && (
                        <Button 
                            type="default" 
                            style={{ width: '200px', height: '40px' }}
                            onClick={() => setShowScanner(false)}
                        >
                            Cerrar Scanner
                        </Button>
                    )}
                    {!showScanner && id === undefined && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Button 
                                type="primary" 
                                style={{ width: '200px', height: '40px' }}
                                onClick={() => setShowScanner(true)}
                            >
                                Escanear QR
                            </Button>
                        </div>
                    )}
                    {showScanner && (
                        <div style={{ marginTop: '20px', position: 'relative', width: '100%', height: '300px' }}>
                            <BarcodeScanner onScanResult={handleScanResult} />
                        </div>
                    )}
                </>
            ) : (
                <h1>Bienvenido</h1>
            )}
        </div>
    );
};

export default Dashboard;
