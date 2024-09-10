import React from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, notification, Tag } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';

const Categories = () => {
    const { categories } = usePage().props;
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
            title: 'Subcategories',
            dataIndex: 'subcategories',
            key: 'subcategories',
            render: (_, record) => record.subcategories.map(cat => <Tag color='blue' key={cat.id}>{cat.name}</Tag>)
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
                    title="Are you sure you want to delete this category?"
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
        return router.post('/categories', values, {
            onSuccess: () => {
                notification.success({ message: 'Category created successfully' });
                setVisible(false);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    const handleEdit = async (id, values) => {
        return router.put(`/categories/${id}`, values, {
            onSuccess: () => {
                notification.success({ message: 'Category updated successfully' });
                setVisible(false);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    const handleDelete = async (id) => {
        return router.delete(`/categories/${id}`, {
            onSuccess: () => notification.success({ message: 'Category deleted successfully' }),
            onError: (error) => {
                console.error(error);
            },
        });
    };

    return (
        <PageContainer title="Manage Categories">
            <ProTable
                bordered
                size='small'
                options={false}
                columns={columns}
                dataSource={categories}
                rowKey="id"
                search={false}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
                        Create Category
                    </Button>
                ]}
            />
            <ModalForm
                width={400}
                title={data ? 'Edit Category' : 'Create Category'}
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
                    label="Category Name"
                    rules={[{ required: true, message: 'Category name is required' }]}
                />
                <ProFormSelect
                    name="parent_id"
                    label="Parent Category"
                    options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                    allowClear
                    placeholder="Select Parent Category (Optional)"
                />
            </ModalForm>
        </PageContainer>
    );
};

export default Categories;
