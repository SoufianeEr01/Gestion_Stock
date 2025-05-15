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
import PageRegistre from './Registre/PageRegistre';
import Login from './Authentification/Login';
import Unauthorized from './Authentification/Unauthorized';

import Commande from './Commandes/commande'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>

          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Login" element={<Login />} />

          {/* Routes accessibles à ROLE_GESTIONNAIRE et ROLE_ADMIN */}
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
                    <Route path="/orders" element={<Commande />} />
                    <Route path="/Reporting" element={<RapportMovements />} />
                    <Route path="/ReportingStock" element={<RapportStock />} />
                    {/* Ne pas mettre /Registre ici */}
                  </Routes>
                </VerticalNavbar>
              </PrivateRoute>
            }
          />

          {/* Route réservée uniquement à ROLE_ADMIN */}
          <Route
            path="/Registre"
            element={
              <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
                <VerticalNavbar>
                  <PageRegistre />
                </VerticalNavbar>
              </PrivateRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;