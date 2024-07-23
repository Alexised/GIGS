import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Space, Modal } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, QrcodeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import GenericTable from '../table/Table';
import Swal from 'sweetalert2';

const ListLocation = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [qrData, setQrData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userDetail = JSON.parse(localStorage.getItem("user"));
  const roleId = userDetail.roleId;

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}locations`);
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
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
          style={{ width: 188, marginBottom: 8, display: "block" }}
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
    setSearchText("");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Supervisor",
      dataIndex: "customer.name",
      key: "supervisor",
      ...getColumnSearchProps(["customer.name"]),
    },
  ];

  const actions = [
    {
      type: 'link',
      label: 'QR',
      icon: <QrcodeOutlined />,
      onClick: (record) => generateQRCode(record.id),
      style: { backgroundColor: "#3DB1FF" },
    },
  ];

  if (roleId === 1) {
    actions.push(
      {
        type: 'link',
        label: '',
        icon: <EditOutlined />,
        onClick: (record) => navigate(`/location/edit/${record.id}`),
        style: { backgroundColor: "#3DB1FF" },
      },
      {
        type: 'popconfirm',
        label: '',
        icon: <DeleteOutlined />,
        danger: true,
        confirmMessage: '¿Está seguro de eliminar esta ubicación?',
        onConfirm: (record) => handleDelete(record.id),
      }
    );
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}locations/${id}`);
      Swal.fire('Éxito', 'Ubicación eliminada exitosamente', 'success');
      fetchForms();
    } catch (error) {
      console.error('Error deleting location:', error);
      Swal.fire('Error', 'No se pudo eliminar la ubicación', 'error');
    }
  };

  const generateQRCode = (id) => {
    setQrData(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setQrData(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setQrData(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de ubicaciones</h1>
      <GenericTable columns={columns} data={forms} actions={actions} />
      {roleId === 1 && (
        <Button
          type="primary"
          onClick={() => navigate("/location/create")}
          style={{ marginTop: "10px", backgroundColor: "#1F5BE3", borderColor: "#1F5BE3" }}
        >
          Crear nueva ubicación
        </Button>
      )}
      <Modal
        title="Código QR"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cerrar
          </Button>,
        ]}
      >
        {qrData && (
          <QRCode value={`${qrData}`} size={256} />
        )}
      </Modal>
    </div>
  );
};

export default ListLocation;
