import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/header'
import Footer from '@/components/footer'
const AppLayout = () => {
  return (
    <>
    <div className='grid-background'></div>
    <main className='min-h-screen container mx-auto px-4'>
    <Header/>
    <Outlet />  
    </main>
    <div className='p-10 text-center bg-gray-800 mt-10'><Footer/></div>
    </>
  )
}

export default AppLayout