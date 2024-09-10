import React from 'react'
import { Layout, message } from 'antd'
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Unauthenticated from '../Layouts/Unauthenticated'
//inertia post
import { router } from '@inertiajs/react'
import axios from 'axios'

function Login() {
    const formRef = React.useRef()
    return (
        
            <LoginForm
            formRef={formRef}
                logo="./logo.svg"
                onFinish={async (values) => {
                    router.post('/login', 
                    values,
                    {
                        onSuccess: (response) => {
                            message.success("Login successful")
                        },
                        onError: (error) => {
                            formRef.current.setFields([
                                {
                                    name: "email",
                                    errors: [error.email]
                                }
                            ])

                        }
                    }
                    )
                }
                }
            >
                <ProFormText
                    name="email"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined />
                    }}
                    placeholder="Email Address"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your email address'
                        },
                        {
                            type: 'email',
                            message: 'Please enter a valid email address'
                        }
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined />
                    }}
                    placeholder="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your password'
                        },
                        {
                            min: 8,
                            message: 'Password must be at least 8 characters'
                        }
                    ]}

                />
            </LoginForm>
    )
}

Login.layout = page => <Unauthenticated children={page} />

export default Login
