import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Space, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import GenericTable from '../table/Table';

const ListUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const token = localStorage.getItem('token');
  const userDetail = JSON.parse(localStorage.getItem('user'));
  const roleId = userDetail.roleId;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}users`, config);
      const transformedUsers = response.data.map(user => ({
        ...user,
        roleName: getRole(user.roleId), // Add roleName property
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}users/${id}`);
      Swal.fire('Éxito', 'Usuario eliminado exitosamente', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            const input = node;
            input && input.focus();
          }}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    render: (text) =>
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

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getRole = (roleId) => {
    switch (roleId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Guardia';
      case 3:
        return 'Supervisor';
      default:
        return '';
    }
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
      dataIndex: 'customer.name',
      key: 'name',
      ...getColumnSearchProps('customer.name'),
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Rol',
      dataIndex: 'roleName',
      key: 'roleId',
      render: (roleId) => getRole(roleId),
    },
  ];
  const actions = [
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
    <div style={{ padding: '20px' }}>
      <h1>Lista de Usuarios</h1>
      <GenericTable columns={columns} data={users} actions={actions} />
      {roleId === 1 && (
        <Button
          type="primary"
          onClick={() => navigate('/user/create')}
          style={{ marginTop: '10px', backgroundColor: '#1F5BE3', borderColor: '#1F5BE3' }}
        >
          Crear nuevo usuario
        </Button>
      )}
    </div>
  );
};

export default ListUsers;
