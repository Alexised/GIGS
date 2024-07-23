import React from 'react';
import { Table as ResponsiveTable, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Button, Space, Popconfirm } from 'antd';

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((value, key) => value?.[key], obj);
};

const GenericTable = ({ columns, data, actions }) => {
  return (
    <ResponsiveTable className="super-responsive-table">
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column.key}>{column.title}</Th>
          ))}
          {actions && <Th>Acción</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item) => (
          <Tr key={item.id}>
            {columns.map((column) => (
              <Td key={column.key}>
                {getNestedValue(item, column.dataIndex)}
              </Td>
            ))}
            {actions && (
              <Td>
                <Space size="middle">
                  {actions.map((action, index) => (
                    <React.Fragment key={index}>
                      {action.type === 'link' && (
                        <Button
                          type="primary"
                          icon={action.icon}
                          onClick={() => action.onClick(item)}
                          style={action.style}
                        >
                          {action.label}
                        </Button>
                      )}
                      {action.type === 'popconfirm' && (
                        <Popconfirm
                          title={action.confirmMessage}
                          onConfirm={() => action.onConfirm(item)}
                          okText="Sí"
                          cancelText="No"
                        >
                          <Button
                            type="primary"
                            danger={action.danger}
                            icon={action.icon}
                            style={action.style}
                          >
                            {action.label}
                          </Button>
                        </Popconfirm>
                      )}
                    </React.Fragment>
                  ))}
                </Space>
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </ResponsiveTable>
  );
};

export default GenericTable;
