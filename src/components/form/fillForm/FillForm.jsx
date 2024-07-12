import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const FillForm = () => {
  const [formConfig, setFormConfig] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem('token');
  useEffect(() => {
    // Simulamos una petición para obtener la configuración del formulario
    const fetchFormConfig = async () => {
      const url = `${import.meta.env.VITE_BASE_URL}`;
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.get(`${url}events/${id}`, config);
      
      setFormConfig(response.data);
    };

    fetchFormConfig();
  }, []);

  const onFinish = (values) => {
    console.log('Formulario enviado:', values);
  };

  if (!formConfig) {
    return <div>Cargando...</div>;
  }

  return (
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
        <Button type="primary" htmlType="submit">
          Enviar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FillForm;
