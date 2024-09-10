import React from 'react'
import { ProLayout} from '@ant-design/pro-components'
import { Link, usePage } from '@inertiajs/react'
import { Dropdown, App } from 'antd'
import { LogoutOutlined, CheckSquareOutlined, DashboardOutlined, OrderedListOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons'


export default function Authenticated({ children }) {
  const { user } = usePage().props;
  const items = [
    {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        danger: true,
        onClick: () => {
            router.post('/logout');
        },
    },
];
  return (
    <ProLayout
        title={false}
        layout='sidebar'
        logo="./logo.svg"
        menuItemRender={(item, dom) => (
          <Link href={item.path}>{dom}</Link>
      )}
      menuDataRender={() => [
        {
          name: 'Dashboard',
          icon: <DashboardOutlined />,
          path: '/home',
        },
        {
          name: 'Issue Tracker',
          icon: <CheckSquareOutlined />,
          path: '/issues',
        },
        {
          name: 'Categories',
          icon: <OrderedListOutlined />,
          path: '/categories',
        },
        {
          name: 'Access Control',
          icon: <UserOutlined />,
          path: '/users',
        },
        {
          name: 'Permissions',
          icon: <SafetyOutlined />,
          path: '/permissions',
        }
      ]
      }
      avatarProps={{
          alt: "avatar",
          src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          title: user?.name,
          render: (_, children) => {
              return (
                  <Dropdown menu={{ items }}>{children}</Dropdown>
              );
          },
      }}
        >
        { children }
        </ProLayout>
  )
}
