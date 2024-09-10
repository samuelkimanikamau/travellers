import React from 'react'
import { Layout } from 'antd'

export default function Unauthenticated({ children }) {
  return (
    <Layout style={{
        //center LoginForm
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        paddingTop: "15vh",
    }}>
        {children}
    </Layout>
  )
}
