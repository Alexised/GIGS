import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BarcodeScanner } from './BarcodeScanner.jsx'; // Asegúrate de la ruta correcta

const Dashboard = () => {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setLoading(true);
        const config = {
            headers: {
                Authorization: token,
            },
        };
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}events`, config);
            const data = response.data;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            Swal.fire('Error', 'Error fetching events', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleScanResult = (result) => {
        if (result) {
            console.log('QR Code Data:', result);
            // Aquí puedes manejar la navegación o cualquier otra acción con el dato escaneado
            navigate(`/${result}`);
        }
        setShowScanner(false); // Ocultar el escáner después de escanear
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>¿Qué deseas hacer? {user.name}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                {events.map((event) => {
                    if (event.name !== 'Ingreso Jornada') {
                        return (
                            <Button key={event.id} type="primary" onClick={() => {
                                if (!id || isNaN(Number(id))) {
                                    // Handle case where id is invalid
                                    console.log('Error: ID is invalid');
                                    navigate('/error'); // Redirect to an error page or handle accordingly
                                } else {
                                    // Construct the URL with the base path, location, and form IDs
                                    const url = `/location/${id}/form/${event.id}`;
                                    console.log(`Navigating to: ${url}`);
                                    navigate(url);
                                }
                            }}>
                                {event.name}
                            </Button>
                        );
                    }
                    return null;
                })}
                <Button type="primary" onClick={() => setShowScanner(true)}>
                    Escanear QR
                </Button>
            </div>
            {showScanner && (
                <div style={{ marginTop: '20px', position: 'relative', width: '100%', height: '300px' }}>
                    <BarcodeScanner onScanResult={handleScanResult} />
                    <Button type="default" onClick={() => setShowScanner(false)} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        Cerrar Scanner
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;