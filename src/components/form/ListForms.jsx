import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const token = localStorage.getItem('token');
import { Link } from 'react-router-dom';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import Swal from "sweetalert2";

const ListForms = () => {
    const navigate = useNavigate(); // Obtains the navigation function
    let url = `${import.meta.env.VITE_BASE_URL}events`;
    const [formularios, setFormularios] = useState([]);
    const [loading, setLoading] = useState(false);
    const userDetail = JSON.parse(localStorage.getItem('user'));
    const roleId = userDetail.roleId;

    const fetchData = async () => {
        setLoading(true);
        const config = {
            headers: {
                Authorization: token,
            },
        };
        const response = await axios.get(url, config);
        const data = response.data;
        setFormularios(data);
        setLoading(false);
    };
    useEffect(() => {

        fetchData();
    }, []);
    const handleEliminar = async(id) => {
        try {
            
            setLoading(true);
            const response = await axios.delete(`${url}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token JWT a los encabezados de la solicitud
                }});
            if (response.status === 200) {
                Swal.fire('Éxito', 'Formulario eliminado correctamente', 'success');
                fetchData();
                // Aquí podrías realizar cualquier acción adicional, como actualizar la lista de formularios mostrados en tu interfaz
            } else {
                Swal.fire('Error', 'Error al eliminar el formulario', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar el formulario:', error);
            Swal.fire('Error', 'Error al eliminar el formulario', 'error');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (record) => (
                <>
                    <Space size="middle">
                        {roleId === 1 && ( // Only show edit and delete buttons for admin (roleId === 1)
                            <>
                                <Popconfirm
                                    title="¿Estás seguro de eliminar este registro?"
                                    onConfirm={() => handleEliminar(record.id)}
                                    okText="Sí"
                                    cancelText="No"
                                >
                                    <Button type="link" danger icon={<DeleteOutlined />} style={{ color: 'red' }} />
                                </Popconfirm>
                            </>
                        )}
                    </Space>
                    <Link to={`/form/${record.id}`}>
                        <Button type="primary" style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '1F5BE3', borderColor: '1F5BE3' }}
                            icon={<FormOutlined />} />
                    </Link>
                </>
            ),
        },
    ];

    return (
        <div>
            <h1>Lista de eventos</h1>
            <Table columns={columns} dataSource={formularios} loading={loading} />
            {roleId === 1 && ( // Only show "Crear nuevo formulario" button for admin
                <Button style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '1F5BE3', borderColor: '1F5BE3' }} type="primary" onClick={() => navigate('/form/create')}>
                    Crear nuevo evento
                </Button>
            )}
        </div>
    );
};

export default ListForms;
