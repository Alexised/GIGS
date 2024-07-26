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
  const [form] = Form.useForm();
  const { locationId, id, eventId } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  console.log(locationId, id, eventId)
  useEffect(() => {
    const fetchFormConfig = async () => {
      const url = `${import.meta.env.VITE_BASE_URL}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    if (eventId) {
      // Fetch event data if eventId is provided
      const eventResponse = await axios.get(`${url}bitacora-events/${eventId}`, config);
      const eventData = eventResponse.data;
      setFormConfig(eventResponse.data);

      // Fill the form with existing event data
      const filledValues = eventData.fields.reduce((acc, field) => {
        if (field.type === 'date') {
          acc[field.label] = moment(field.value, 'YYYY-MM-DD');
        } else if (field.type === 'datetime') {
          acc[field.label] = moment(field.value, 'YYYY-MM-DD HH:mm:ss');
        } else if (field.type === 'time') {
          acc[field.label] = moment(field.value, 'HH:mm:ss');
        } else {
          acc[field.label] = field.value;
        }
        return acc;
      }, {});
      form.setFieldsValue(filledValues);
    } else {
      const response = await axios.get(`${url}events/${id}`, config);
      setFormConfig(response.data);
    }
    };

    fetchFormConfig();
  }, [id, eventId, token, form]);

  const onFinish = async (values) => {
    if (eventId) {
      Swal.fire('Información', 'Este formulario es solo de lectura', 'info');
      return;
    }

    setLoading(true);
    try {
      // Transform form values into the required activities format
      const activities = formConfig.fields.map((field) => ({
        type: field.type,
        label: field.label,
        value: values[field.label] instanceof moment 
        ? (field.type === 'time' ? values[field.label].format('HH:mm:ss') : values[field.label].format('YYYY-MM-DD HH:mm:ss'))
        : values[field.label] // Format date values// Format date values
      }));

      const dataToSend = {
        nameForm: formConfig.name,
        activities: activities,
        userId: user.id,
        locationId: locationId
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

      Swal.fire('Creado', 'Bitácora creada', 'success');
      navigate('/form'); // Adjust this path as necessary

    } catch (error) {
      Swal.fire('Error', 'Error al crear bitácora', 'error');
      console.error('Error creating/updating bitacora:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!formConfig) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Title level={2}>{formConfig.name}</Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        {formConfig.fields.map((field, index) => {
          switch (field.type) {
            case 'text':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Ingrese ${field.label}` }]}>
                  <Input disabled={!!eventId} />
                </Form.Item>
              );
            case 'textarea':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Ingrese ${field.label}` }]}>
                  <Input.TextArea disabled={!!eventId} />
                </Form.Item>
              );
            case 'number':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Ingrese ${field.label}` }]}>
                  <InputNumber style={{ width: '100%' }} disabled={!!eventId} />
                </Form.Item>
              );
            case 'date':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <DatePicker style={{ width: '100%' }} disabled={!!eventId} />
                </Form.Item>
              );
            case 'time':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <TimePicker style={{ width: '100%' }} disabled={!!eventId} />
                </Form.Item>
              );
            case 'datetime':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <DatePicker showTime style={{ width: '100%' }} disabled={!!eventId} />
                </Form.Item>
              );
            case 'image':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Suba ${field.label}` }]}>
                  <Upload disabled={!!eventId}>
                    <Button icon={<UploadOutlined />}>Subir {field.label}</Button>
                  </Upload>
                </Form.Item>
              );
            case 'select':
              return (
                <Form.Item key={index} label={field.label} name={field.label} rules={[{ required: true, message: `Seleccione ${field.label}` }]}>
                  <Select disabled={!!eventId}>
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

        {!eventId && (
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Enviar
            </Button>
          </Form.Item>
        )}
      </Form>
    </>
  );
};

export default FillForm;
