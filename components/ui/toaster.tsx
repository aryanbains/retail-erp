"use client"

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: 'green',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: 'red',
          },
        },
      }}
    />
  )
}