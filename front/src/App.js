// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Ajout de l'import du toast
import 'react-toastify/dist/ReactToastify.css'; // Import du CSS obligatoire

import VerticalNavbar from './Composants/NavBarVertical';

// Import de tes composants de pages
import PagePrincipal from './Gestion_Stock/Page/Product/PagePrincipal';
import ShowProviders from './Gestion_Stock/Page/Provider/ShowProviders';
import StockDashboard from './Gestion_Stock/StockDashboard';
import PagePrincipaleLocation from './Gestion_Stock/Page/location/PagePrincipaleLocation';
import PagePrincipalStock from './Gestion_Stock/Page/Stock/PagePrincipalStock';
import PagePrincipaleMovement from './Gestion_Stock/Page/MovementStock/PagePrincipaleMovement';
import RapportMovements from './Reporting/RapportMovements';
import RapportStock from './Reporting/RapportStock';

function App() {
  return (
    <Router>
      <VerticalNavbar>
        <Routes>
          <Route path="/" element={<StockDashboard />} />
          <Route path="/product" element={<PagePrincipal />} />
          <Route path="/location" element={<PagePrincipaleLocation />} />
          <Route path="/movement" element={<PagePrincipaleMovement />} />
          <Route path="/stock" element={<PagePrincipalStock />} />
          <Route path="/provider" element={<ShowProviders />} />
          <Route path="/Reporting" element={<RapportMovements />} />
          <Route path="/ReportingStock" element={<RapportStock/>} />
        </Routes>
      </VerticalNavbar>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
