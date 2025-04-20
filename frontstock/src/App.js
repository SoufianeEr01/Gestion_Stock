import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerticalNavbar from './Composants/NavBarVertical';

import PagePrincipal from './Gestion_Stock/Page/Product/PagePrincipal';

function App() {
  return (
    <Router>
      <div className="app-container">
        <VerticalNavbar />

        <div className="content-container">
          <Routes>
            <Route path="/Product" element={<PagePrincipal />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
