import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import VerticalNavbar from './Composants/NavBarVertical';
import PrivateRoute from './Authentification/PrivateRoute';
import { AuthProvider } from './Authentification/AuthContext';

// Pages
import PagePrincipal from './Gestion_Stock/Page/Product/PagePrincipal';
import ShowProviders from './Gestion_Stock/Page/Provider/ShowProviders';
import StockDashboard from './Gestion_Stock/StockDashboard';
import PagePrincipaleLocation from './Gestion_Stock/Page/location/PagePrincipaleLocation';
import PagePrincipalStock from './Gestion_Stock/Page/Stock/PagePrincipalStock';
import PagePrincipaleMovement from './Gestion_Stock/Page/MovementStock/PagePrincipaleMovement';
import RapportMovements from './Reporting/RapportMovements';
import RapportStock from './Reporting/RapportStock';
import Register from './Authentification/Registre';
import Login from './Authentification/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Registre" element={<Register />} />
          <Route path="/Login" element={<Login />} />

          <Route
            path="/*"
            element={
              <PrivateRoute allowedRoles={['ROLE_GESTIONNAIRE', 'ROLE_ADMIN']}>
                <VerticalNavbar>
                  <Routes>
                    <Route path="/dashboard" element={<StockDashboard />} />
                    <Route path="/product" element={<PagePrincipal />} />
                    <Route path="/location" element={<PagePrincipaleLocation />} />
                    <Route path="/movement" element={<PagePrincipaleMovement />} />
                    <Route path="/stock" element={<PagePrincipalStock />} />
                    <Route path="/provider" element={<ShowProviders />} />
                    <Route path="/Reporting" element={<RapportMovements />} />
                    <Route path="/ReportingStock" element={<RapportStock />} />
                  </Routes>
                </VerticalNavbar>
              </PrivateRoute>
            }
          />

          <Route path="/unauthorized" element={<h2>Accès non autorisé</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
