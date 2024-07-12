import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useFetchSupervisors from '../../../hooks/useFetchSupervisors';

const { Option } = Select;

const CreateLocation = () => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { supervisors, loading: loadingSupervisors, error: errorSupervisors } = useFetchSupervisors();
  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BASE_URL}locations`;
      const response = await axios.post(url, values);
      if (!response) {
        throw new Error('Failed to create location');
      }
      Swal.fire('Creado', 'Ubicación creada', 'success');
      setLoading(false);
    } catch (error) {
      console.error('Error creating location:', error);
      Swal.fire('Error', 'Error al crear ubicación', 'error');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Crear Ubicación</h1>
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
            name="supervisor"
            label="Supervisor"
            rules={[{ required: true, message: 'por favor seleccione Supervisor' }]}
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
            Crear Ubicación
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default  CreateLocation ;
