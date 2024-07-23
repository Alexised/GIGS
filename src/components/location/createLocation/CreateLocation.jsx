import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useFetchSupervisors from '../../../hooks/useFetchSupervisors';

const { Option } = Select;

const CreateLocation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { supervisors, loading: loadingSupervisors, error: errorSupervisors } = useFetchSupervisors();

  useEffect(() => {
    if (id) {
      fetchLocationDetails(id);
    }
  }, [id]);

  const fetchLocationDetails = async (locationId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}locations/${locationId}`);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (id) {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}locations/${id}`, values);
        if (!response) {
          throw new Error('Failed to update location');
        }
        Swal.fire('Actualizado', 'Ubicación actualizada', 'success');
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}locations`, values);
        if (!response) {
          throw new Error('Failed to create location');
        }
        Swal.fire('Creado', 'Ubicación creada', 'success');
      }
      setLoading(false);
      navigate('/location'); // Ajusta esta ruta según sea necesario
    } catch (error) {
      if (id) {
        Swal.fire('Error', 'Error al actualizar ubicación', 'error');
      }else{
        Swal.fire('Error', 'Error al crear ubicación', 'error');

      }
      console.error('Error creating/updating location:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{id ? 'Editar Ubicación' : 'Crear Ubicación'}</h1>
      <Form
        form={form}
        layout="vertical"
        name="create_location"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Nombre de la Ubicación"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="customerId"
          label="Supervisor"
          rules={[{ required: true, message: 'Por favor seleccione un Supervisor' }]}
        >
          <Select placeholder="Supervisor" loading={loadingSupervisors}>
            {supervisors.map((supervisor) => (
              <Option key={supervisor.id} value={supervisor.id}>
                {supervisor.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            style={{
              marginLeft: '10px',
              marginRight: '10px',
              backgroundColor: '1F5BE3',
              borderColor: '1F5BE3',
            }}
            htmlType="submit"
            loading={loading}
          >
            {id ? 'Actualizar Ubicación' : 'Crear Ubicación'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateLocation;