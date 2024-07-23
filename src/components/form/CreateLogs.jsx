import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Switch } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Option } = Select;

const CreateLogs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
    if (id) {
      fetchBitacoraDetails(id);
    }
  }, [id]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}locations`);
      setLocations(response.data);
      setLoadingLocations(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoadingLocations(false);
    }
  };

  const fetchBitacoraDetails = async (bitacoraId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}logs/${bitacoraId}`);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching bitacora details:', error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (id) {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}logs/${id}`, values);
        if (!response) {
          throw new Error('Failed to update bitacora');
        }
        Swal.fire('Actualizado', 'Bitácora actualizada', 'success');
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}logs`, values);
        if (!response) {
          throw new Error('Failed to create bitacora');
        }
        Swal.fire('Creado', 'Bitácora creada', 'success');
      }
      setLoading(false);
      navigate('/logs'); // Adjust this path as necessary
    } catch (error) {
      if (id) {
        Swal.fire('Error', 'Error al actualizar bitácora', 'error');
      } else {
        Swal.fire('Error', 'Error al crear bitácora', 'error');
      }
      console.error('Error creating/updating bitacora:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{id ? 'Editar Bitácora' : 'Crear Bitácora'}</h1>
      <Form
        form={form}
        layout="vertical"
        name="create_bitacora"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Nombre de la Bitácora"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="locationId"
          label="Ubicación"
          rules={[{ required: true, message: 'Por favor seleccione una Ubicación' }]}
        >
          <Select placeholder="Ubicación" loading={loadingLocations}>
            {locations.map((location) => (
              <Option key={location.id} value={location.id}>
                {location.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {id && (
          <Form.Item
            name="active"
            label="Activo"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        )}
        
        <Form.Item>
          <Button
            type="primary"
            style={{
              marginLeft: '10px',
              marginRight: '10px',
              backgroundColor: '#1F5BE3',
              borderColor: '#1F5BE3',
            }}
            htmlType="submit"
            loading={loading}
          >
            {id ? 'Actualizar Bitácora' : 'Crear Bitácora'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateLogs;
