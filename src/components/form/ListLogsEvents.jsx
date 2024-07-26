import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Space, message } from 'antd';
import GenericTable from '../table/Table'; // Assuming the file is in the same directory
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ListLogsEvents = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}bitacora-events/bitacora/${id}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}events/bitacora${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
      message.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      message.error('Error deleting event');
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
    // {
    //   type: 'popconfirm',
    //   label: '',
    //   icon: <DeleteOutlined />,
    //   danger: true,
    //   confirmMessage: '¿Está seguro de eliminar este evento?',
    //   onConfirm: (record) => handleDelete(record.id)
    // },
  ];

  return (
    <div>
      <h1>Eventos de la Bitácora</h1>
      <GenericTable columns={columns} data={events} actions={actions} rowKey="id" />
      <Space style={{ marginTop: 20 }}>
        <Button type="primary" onClick={() => navigate(`/logs`)}>Volver a Bitácoras</Button>
      </Space>
    </div>
  );
};

export default ListLogsEvents;
