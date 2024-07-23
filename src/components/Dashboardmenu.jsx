
import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const userDetail = JSON.parse(localStorage.getItem('user'));
    const roleId = userDetail.roleId;

    const fetchData = async () => {
        setLoading(true);
        const config = {
            headers: {
                Authorization: token,
            },
        };
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}events`, config);
        const data = response.data;
        setEvents(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <Spin />;
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>¿Qué deseas hacer? {user.name}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                { events.map((event) => {
                    if (event.name !== 'Ingreso Jornada') {
                        return (
                            <Button key={event.id} 
                                type="primary" onClick={() => navigate(`/form/${event.id}`)}>
                                {event.name}
                            </Button>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default Dashboard;
