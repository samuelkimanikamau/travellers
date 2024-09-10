import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { ConfigProvider, App } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import Authenticated from './Pages/Layouts/Authenticated'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    let page = pages[`./Pages/${name}.jsx`]
    page.default.layout = page.default.layout || (page => <App><Authenticated children={page} /></App>)
    return page
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <ConfigProvider
        locale={enUS}
        theme={{
          token: {
            //fontFamily: "jost",
            colorPrimary: "#ff7216",
          },
        }}
      >
        <App {...props} />
      </ConfigProvider>
    )
  },
})