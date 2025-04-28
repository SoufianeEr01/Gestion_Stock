// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerticalNavbar from './Composants/NavBarVertical';
/** @type {import('tailwindcss').Config} */
// Importez vos composants de page
 import PagePrincipal from './Gestion_Stock/Page/Product/PagePrincipal';
import ShowProviders from './Gestion_Stock/Page/Provider/ShowProviders';
import StockDashboard from './Gestion_Stock/StockDashboard';
import PagePrincipaleLocation from './Gestion_Stock/Page/location/PagePrincipaleLocation';
function App() {
  return (
    <Router>
      <VerticalNavbar>
        <Routes>
          {/* Routes principales */}
          <Route path="/" element={<StockDashboard />} />
          <Route path="/product" element={<PagePrincipal />} />
          <Route path="/location" element={<PagePrincipaleLocation />} />
          <Route path="/provider" element={<ShowProviders />} />
        </Routes>
      </VerticalNavbar>
    </Router>
  );
}

export default App;