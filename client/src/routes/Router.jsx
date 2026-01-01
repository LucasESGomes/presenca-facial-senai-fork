import { BrowserRouter, Router, Routes, Route } from 'react-router-dom'
import { ROUTES } from './index.js'

import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'

import LoginPage from '../pages/LoginPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.PUBLIC.LOGIN} element={< LoginPage />}></Route>
        <Route path={ROUTES.PRIVATE.DASHBOARD} element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }></Route>
        


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}