import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'; // Importar el ícono de "ver" desde antd
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import { useNavigate } from 'react-router-dom';

const ListFills = () => {
  const navigate = useNavigate(); 
  const [forms, setForms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const userDetail = JSON.parse(localStorage.getItem('user'));
  const roleId = userDetail.roleId;
  useEffect(() => {
    // Cargar los formularios al montar el componente
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}fills`);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
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
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Nombre de la bitacora',
      dataIndex: 'codeInspectionCompany',
      key: 'codeInspectionCompany',
      ...getColumnSearchProps('codeInspectionCompany'),
    },
    {
      title: 'ubicacion',
      dataIndex: 'city',
      key: 'city',
      ...getColumnSearchProps('city'),
    },
    {
      title: 'supervisor',
      dataIndex: 'codeForm',
      key: 'codeForm',
      ...getColumnSearchProps('codeForm'),
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/show/form/${record.id}`}>
            <Button style={{ backgroundColor: '#3DB1FF' }} type="primary" icon={<EyeOutlined />} >Ver</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return(
  <div>
    <h1>Lista de bitacoras</h1>
    <Table columns={columns} dataSource={forms} />
    {roleId === 1 && ( // Only show "Crear nuevo formulario" button for admin
      <Button style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '1F5BE3', borderColor: '1F5BE3' }} type="primary" onClick={() => navigate('/form/create')}>
        Crear nueva bitacora
      </Button>
    )}
  </div>
  )
};

export default ListFills;
