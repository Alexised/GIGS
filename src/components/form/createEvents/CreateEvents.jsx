import React, { useState } from 'react';
import { Form, Input, Button, Space, Select, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Swal from "sweetalert2";

const { Option } = Select;

const CreateEvents = () => {
  const [fields, setFields] = useState([{ type: '', label: '', options: [] }]);
  const token = localStorage.getItem('token');
  
  const addField = () => {
    setFields([...fields, { type: '', label: '', options: [] }]);
  };

  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const onFinish = async (values) => {
    const url = `${import.meta.env.VITE_BASE_URL}events`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          name: values.name,
          fields: fields,
        }),
      });

      if (!response.ok) {
        Swal.fire("Error", "Error al crear el evento, valide los datos", "error");
        throw new Error('Failed to create event');
      }

      Swal.fire("Éxito", "¡Evento creado exitosamente!", "success");
    } catch (error) {
      console.error('Error creating event:', error);
      Swal.fire("Error", "Error al crear el evento, valide los datos", "error");
    }
  };

  const handleOptionsChange = (index, newOptions) => {
    const updatedFields = [...fields];
    updatedFields[index].options = newOptions;
    setFields(updatedFields);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item label="Nombre del evento" name="name" required>
        <Input />
      </Form.Item>

      {fields.map((field, index) => (
        <Row key={index} align="middle" style={{ marginBottom: 8 }}>
          <Col span={8}>
            <Form.Item label={`Tipo de campo ${index + 1}`} required>
              <Select
                value={field.type}
                style={{ width: '100%' }}
                onChange={(value) => {
                  const updatedFields = [...fields];
                  updatedFields[index].type = value;
                  setFields(updatedFields);
                }}
              >
                <Option value="text">Texto</Option>
                <Option value="textarea">Área de texto</Option>
                <Option value="number">Número</Option>
                <Option value="date">Fecha</Option>
                <Option value="image">Imagen</Option>
                <Option value="select">Selección</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item label="Etiqueta" required>
              <Input
                value={field.label}
                onChange={(e) => {
                  const updatedFields = [...fields];
                  updatedFields[index].label = e.target.value;
                  setFields(updatedFields);
                }}
              />
            </Form.Item>
          </Col>
          {field.type === 'select' && (
            <Col span={22}>
              <Form.Item label="Opciones" required>
                <Select
                  mode="tags"
                  placeholder="Ingrese las opciones"
                  value={field.options}
                  onChange={(newOptions) => handleOptionsChange(index, newOptions)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={2}>
            {fields.length > 1 && (
              <Button type="link" style={{ color: 'red' }} onClick={() => removeField(index)} icon={<MinusCircleOutlined />} />
            )}
          </Col>
        </Row>
      ))}

      <Form.Item>
        <Space style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <Button style={{ color: '#3DB1FF' }} type="link" onClick={addField} icon={<PlusOutlined />}>
            Agregar campo
          </Button>
          <Button style={{ backgroundColor: '#1F5BE3', borderColor: '#3DB1FF' }} type="primary" htmlType="submit">
            Enviar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateEvents;
