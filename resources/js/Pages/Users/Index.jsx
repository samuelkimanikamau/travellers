import React from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, notification, Tag } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';

const Users = () => {
    const { users, permissions } = usePage().props;
    
    const [data, setData] = React.useState(null);
    const [visible, setVisible] = React.useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            hideInTable: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (_, record) => {
                return record.permissions.map(p => <Tag key={p.id} color="blue">{p.name}</Tag>)
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            valueType: 'option',
            render: (_, record) => [
                <Button size='small' key="edit" icon={<EditOutlined />} onClick={() => {
                    record.permissions = record.permissions.map(p => p.name);
                    setData(record);
                    setVisible(true);
                }}>Edit</Button>,
                <Popconfirm
                    title="Are you sure you want to delete this user?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button size='small' danger>Delete</Button>
                </Popconfirm>
            ]
        },
    ];

    const handleCreate = async (values) => {
        return router.post('/users', values, {
            onSuccess: () => {
                notification.success({ message: 'User created successfully' });
                setVisible(false);
            },
            onError: (error) => {
                formRef.current.setFields([
                    {
                        name: "name",
                        errors: [error.name]
                    }
                ])
            },
        });
    };

    const handleEdit = async (id, values) => {
        return router.put(`/users/${id}`, values, {
            onSuccess: () => {
                notification.success({ message: 'User updated successfully' });
                setVisible(false);
            },
            onError: (error) => {
                formRef.current.setFields([
                    {
                        name: "name",
                        errors: [error.name]
                    }
                ])
            },
        });
    };

    const handleDelete = async (id) => {
        return router.delete(`/users/${id}`, {
            onSuccess: () => notification.success({ message: 'User deleted successfully' }),
            onError: (error) => {
                message.error(error.message);
            },
        });
    };

    return (
        <PageContainer title="Manage Users">
            <ProTable
                bordered
                size='small'
                options={false}
                columns={columns}
                dataSource={users}
                rowKey="id"
                search={false}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
                        Create User
                    </Button>
                ]}
            />
            <ModalForm
                width={400}
                title={data ? 'Edit User' : 'Create User'}
                onFinish={data ? (values) => handleEdit(data.id, values) : handleCreate}
                open={visible}
                initialValues={data}
                modalProps={{
                    onCancel: () => setVisible(false),
                    destroyOnClose: true,
                    afterClose: () => setData(null),
                }}
            >
                <ProFormText
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Name is required' }]}
                />
                <ProFormText
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Email is required' }]}
                />
                <ProFormText.Password
                    name="password"
                    label="Password"
                    rules={[{ required: !data, message: 'Password is required' }]}
                />
                <ProFormSelect
                    name="permissions"
                    label="Permissions"
                    mode="multiple"
                    initialValue={data ? data.permissions.map(p => p.name) : []}
                    options={permissions.map(p => ({ label: p.name, value: p.name }))}
                    rules={[{ required: true, message: 'Please select at least one permission' }]}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default Users;
