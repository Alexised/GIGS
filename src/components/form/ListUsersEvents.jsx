import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Space, message } from 'antd';
import GenericTable from '../table/Table'; // Assuming the file is in the same directory
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ListUsersEvents = () => {
  const userDetail = JSON.parse(localStorage.getItem('user'));
  const userId = userDetail.id
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}bitacora-events/user/${userId}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'nameForm',
      key: 'name',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'creationDate',
      key: 'creationDate',
    },
    {
      title: 'Guardia',
      dataIndex: 'customer.name',
      key: 'customer.name',
    },
    // Add more columns as needed
  ];

  const actions = [
    {
      type: 'link',
      label: '',
      icon: <EyeOutlined />,
      style: { backgroundColor: '#3DB1FF' },
      onClick: (record) => navigate(`/show/form/${record.id}`)
    },
  ];

  return (
    <div>
      <h1>Eventos de la Bitácora</h1>
      <GenericTable columns={columns} data={events} actions={actions} rowKey="id" />
      <Space style={{ marginTop: 20 }}>
        <Button type="primary" onClick={() => navigate(`/`)}>Volver a Bitácoras</Button>
      </Space>
    </div>
  );
};

export default ListUsersEvents;
