import React from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';

const Permissions = () => {
    const { permissions } = usePage().props;
    const formRef = React.useRef();
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
            title: 'Actions',
            key: 'actions',
            valueType: 'option',
            render: (_, record) => [
                <Button size='small' key="edit" icon={<EditOutlined />} onClick={() => {
                    setData(record);
                    setVisible(true);
                }}>Edit</Button>,
                <Popconfirm
                    title="Are you sure you want to delete this permission?"
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
        return router.post('/permissions', values, {
            onSuccess: () => {
                notification.success({ message: 'Permission created successfully' });
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
        return router.put(`/permissions/${id}`, values, {
            onSuccess: () => {
                notification.success({ message: 'Permission updated successfully' });
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
        return router.delete(`/permissions/${id}`, {
            onSuccess: () => notification.success({ message: 'Permission deleted successfully' }),
            onError: (error) => {
                message.error(error.message);
            },
        });
    };

    return (
        <PageContainer title="Manage Permissions">
            <ProTable
                bordered
                size='small'
                options={false}
                columns={columns}
                dataSource={permissions}
                rowKey="id"
                search={false}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
                        Create Permission
                    </Button>
                ]}
            />
            <ModalForm
                width={400}
                title={data ? 'Edit Permission' : 'Create Permission'}
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
                    label="Permission Name"
                    rules={[{ required: true, message: 'Permission name is required' }]}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default Permissions;
