import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Select, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const { Option } = Select;

const CreateEvents = () => {
  const [fields, setFields] = useState([{ type: '', label: '', options: [] }]);
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchEventData(id);
    }
  }, [id]);

  const fetchEventData = async (eventId) => {
    const url = `${import.meta.env.VITE_BASE_URL}events/${eventId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        form.setFieldsValue({ name: data.name });
        setFields(data.fields || [{ type: '', label: '', options: [] }]);
      } else {
        Swal.fire("Error", "Error al obtener los datos del evento", "error");
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
      Swal.fire("Error", "Error al obtener los datos del evento", "error");
    }
  };

  const addField = () => {
    setFields([...fields, { type: '', label: '', options: [] }]);
  };

  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const onFinish = async (values) => {
    const url = id
      ? `${import.meta.env.VITE_BASE_URL}events/${id}`
      : `${import.meta.env.VITE_BASE_URL}events`;
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
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
        Swal.fire("Error", "Error al crear o editar el evento, valide los datos", "error");
        throw new Error('Failed to create or edit event');
      }

      Swal.fire("Éxito", `¡Evento ${id ? 'editado' : 'creado'} exitosamente!`, "success");
      navigate('/forms'); // Adjust this path as necessary
    } catch (error) {
      console.error('Error creating or editing event:', error);
      Swal.fire("Error", "Error al crear o editar el evento, valide los datos", "error");
    }
  };

  const handleOptionsChange = (index, newOptions) => {
    const updatedFields = [...fields];
    updatedFields[index].options = newOptions;
    setFields(updatedFields);
  };

  return (
    <div>
      <h1>{id ? 'Editar evento' : 'Crear evento'}</h1>
      <Form form={form} onFinish={onFinish}>
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
                  <Option value="time">Hora</Option>
                  <Option value="datetime">Fecha y Hora</Option>
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
    </div>
  );
};

export default CreateEvents;
