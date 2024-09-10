import React, { useState } from 'react';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-components';
import { Button, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';

const Issues = () => {
    const { issues, categories, users, search } = usePage().props;
    const [data, setData] = useState(null);
    const [visible, setVisible] = useState(false);

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            key: 'category',
            valueType: 'select',
            valueEnum: categories.reduce((acc, cat) => {
                acc[cat.id] = cat.name;
                cat.subcategories.forEach(sub => acc[sub.id] = sub.name);
                return acc;
            }, {}),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            valueType: 'select',
            valueEnum: {
                'Open': { text: 'Open', status: 'Default' },
                'In Progress': { text: 'In Progress', status: 'Processing' },
                'Resolved': { text: 'Resolved', status: 'Success' },
                'Closed': { text: 'Closed', status: 'Error' },
            }
        },
        {
            title: 'Created By',
            dataIndex: ['creator', 'name'],
            key: 'created_by',
            hideInSearch: true,
        },
        {
            title: 'Assigned To',
            dataIndex: 'assignees',
            key: 'assigned_to',
            hideInSearch: true,
            render: (_, record) => record.assignees.map(user => user.name).join(', '),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            valueType: 'date',
            hideInSearch: true,
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
                    title="Are you sure you want to delete this issue?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button size='small' danger>Delete</Button>
                </Popconfirm>
            ]
        },
    ];

    const handleSearch = async (params) => {
        router.get('/issues', params, { preserveState: true });
    };

    const handleCreate = async (values) => {
        return router.post('/issues', values, {
            onSuccess: () => {
                notification.success({ message: 'Issue created successfully' });
                setVisible(false);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    const handleEdit = async (id, values) => {
        return router.put(`/issues/${id}`, values, {
            onSuccess: () => {
                notification.success({ message: 'Issue updated successfully' });
                setVisible(false);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    const handleDelete = async (id) => {
        return router.delete(`/issues/${id}`, {
            onSuccess: () => notification.success({ message: 'Issue deleted successfully' }),
            onError: (error) => {
                console.error(error);
            },
        });
    };

    return (
        <PageContainer title="Issues">
            <ProTable
                headerTitle="Manage Issues"
                bordered
                size='small'
                options={false}
                columns={columns}
                dataSource={issues}
                rowKey="id"
                search={{
                    layout: 'vertical',
                    defaultValue: search,
                    onSearch: (params) => handleSearch(params),
                }}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
                        Create Issue
                    </Button>
                ]}
            />
            <ModalForm
                width={600}
                title={data ? 'Edit Issue' : 'Create Issue'}
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
                    name="description"
                    label="Issue Description"
                    rules={[{ required: true, message: 'Issue description is required' }]}
                />
                <ProFormSelect
                    name="category_id"
                    label="Category"
                    options={categories.map(category => {
                        let data = { 
                            label: category.name, 
                            value: category.id,
                        };
                        if (category?.subcategories?.length > 0) {
                            data.children = category.subcategories.map(child => ({
                                label: child.name,
                                value: child.id,
                            }));
                        }
                        return data;
                    })}
                    rules={[{ required: true, message: 'Please select a category' }]}
                />
                <ProFormSelect
                    name="assigned_to"
                    label="Assigned To"
                    mode="multiple"
                    options={users.map(user => ({ label: user.name, value: user.id }))}
                    rules={[{ required: true, message: 'Please assign at least one user' }]}
                />
                <ProFormDatePicker
                    name="start_date"
                    label="Start Date"
                    rules={[{ required: true, message: 'Start date is required' }]}
                    fieldProps={{
                        style: { width: '100%' }
                    }}
                />
                <ProFormDatePicker
                    name="end_date"
                    label="End Date"
                    rules={[{ required: true, message: 'End date is required' }]}
                    fieldProps={{
                        style: { width: '100%' }
                    }}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default Issues;
