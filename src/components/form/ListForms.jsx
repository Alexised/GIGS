import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Space, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import GenericTable from '../table/Table';
import Swal from "sweetalert2";

const ListForms = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const userDetail = JSON.parse(localStorage.getItem('user'));
  const roleId = userDetail.roleId;
  const token = localStorage.getItem('token');
  const url = `${import.meta.env.VITE_BASE_URL}events`;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(url, config);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.delete(`${url}/${id}`, config);
      if (response.status === 200) {
        Swal.fire('Éxito', 'Evento eliminado correctamente', 'success');
        fetchEvents();
      } else {
        Swal.fire('Error', 'Error al eliminar el evento', 'error');
      }
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      Swal.fire('Error', 'Error al eliminar el evento', 'error');
    }
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            const input = node;
            input && input.focus();
          }}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
    },
  ];

  const actions = [
    {
      type: 'link',
      label: '',
      icon: <FormOutlined />,
      onClick: (record) => navigate(`/form/edit/${record.id}`)
    },
    {
      type: 'popconfirm',
      label: '',
      icon: <DeleteOutlined />,
      danger: true,
      confirmMessage: '¿Estás seguro de eliminar este evento?',
      onConfirm: (record) => handleDelete(record.id)
    },
  ];

  return (
    <div>
      <h1>Lista de eventos</h1>
      <GenericTable columns={columns} data={events} actions={actions} />
      {roleId === 1 && (
        <Button
          style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#1F5BE3', borderColor: '#1F5BE3' }}
          type="primary"
          onClick={() => navigate('/form/create')}
        >
          Crear nuevo evento
        </Button>
      )}
    </div>
  );
};

export default ListForms;
