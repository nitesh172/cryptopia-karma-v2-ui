import React from 'react'
import { BrowserRouter, Routes, Outlet, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/home'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
            <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
