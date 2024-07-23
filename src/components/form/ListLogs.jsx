import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Space, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import GenericTable from '../table/Table'; // Assuming the file is in the same directory

const ListFills = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const userDetail = JSON.parse(localStorage.getItem('user'));
  const roleId = userDetail.roleId;

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}logs`);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}logs/${id}`);
      setForms(forms.filter(form => form.id !== id));
      message.success('Log deleted successfully');
    } catch (error) {
      console.error('Error deleting form:', error);
      message.error('Error deleting log');
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Ubicación',
      dataIndex: 'location.name',
      key: 'locationName',
      ...getColumnSearchProps('location.name'),
    },
    {
      title: 'Supervisor',
      dataIndex: 'location.customer.name',
      key: 'supervisorName',
      ...getColumnSearchProps('location.customer.name'),
    },
  ];

  const actions = [
    {
      type: 'link',
      label: '',
      icon: <EyeOutlined />,
      style: { backgroundColor: '#3DB1FF' },
      onClick: (record) => navigate(`/show/logs/${record.id}`)
    },
    {
      type: 'link',
      label: '',
      icon: <EditOutlined />,
      onClick: (record) => navigate(`/logs/edit/${record.id}`)
    },
    {
      type: 'popconfirm',
      label: '',
      icon: <DeleteOutlined />,
      danger: true,
      confirmMessage: '¿Está seguro de eliminar esta bitacora?',
      onConfirm: (record) => handleDelete(record.id)
    },
  ];

  return (
    <div>
      <h1>Lista de bitacoras</h1>
      <GenericTable columns={columns} data={forms} actions={actions} />
      {roleId !== 2 && (
        <Button
          style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#1F5BE3', borderColor: '#1F5BE3' }}
          type="primary"
          onClick={() => navigate('/logs/create')}
        >
          Crear nueva bitacora
        </Button>
      )}
    </div>
  );
};

export default ListFills;