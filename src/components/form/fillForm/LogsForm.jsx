import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, Upload, TimePicker, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

const FillForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const { locationId,id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormConfig = async () => {
      const url = `${import.meta.env.VITE_BASE_URL}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${url}events/${id}`, config);
      setFormConfig(response.data);
    };

    fetchFormConfig();
  }, [id, token]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Transform form values into the required activities format
      const activities = formConfig.fields.map((field) => ({
        type: field.type,
        label: field.label,
        value: values[field.label] instanceof moment ? values[field.label].format('YYYY-MM-DD') : values[field.label] // Format date values
      }));

      const dataToSend = {
        nameForm: formConfig.name,
        activities: activities,
        userId: user.id,
        locationId:locationId
      };

      const url = `${import.meta.env.VITE_BASE_URL}bitacora-events`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(url, dataToSend, config);
      if (!response) {
        throw new Error('Failed to create bitacora');
      }
      debugger
      Swal.fire('Creado', 'Bitácora creada', 'success');

      setLoading(false);
    } catch (error) {
      Swal.fire('Error', 'Error al crear bitácora', 'error');
      console.error('Error creating/updating bitacora:', error);
      setLoading(false);
    }
  };

  if (!formConfig) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Title level={2}>{formConfig.name}</Title>
      <Form onFinish={onFinish}>
        {formConfig.fields.map((field, index) => {
          switch (field.type) {
            case 'text':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Ingrese ${field.label}` }]}>
                  <Input />
                </Form.Item>
              );
            case 'textarea':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Ingrese ${field.label}` }]}>
                  <Input.TextArea />
                </Form.Item>
              );
            case 'number':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Ingrese ${field.label}` }]}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              );
            case 'date':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              );
            case 'time':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <TimePicker style={{ width: '100%' }} />
                </Form.Item>
              );
            case 'datetime':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              );
            case 'image':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Suba ${field.label}` }]}>
                  <Upload>
                    <Button icon={<UploadOutlined />}>Subir {field.label}</Button>
                  </Upload>
                </Form.Item>
              );
            case 'select':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <Select>
                    {field.options.map((option, idx) => (
                      <Option key={idx} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            default:
              return null;
          }
        })}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FillForm;
