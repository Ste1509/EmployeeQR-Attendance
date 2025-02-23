import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import { Nav, Footer } from './components/LayoutComponents'
import './components/EmployeeDetail'
import EmployeeList from './components/EmployeeList';
import ScheduleList from './components/ScheduleList';
import ScheduleDetail from './components/ScheduleDetail';
import RegisterList from './components/RegisterList';
import RegisterPage from './components/RegisterPage';
import Login from './components/Login';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Simulación de verificación de autenticación
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsAuthenticated(true);
      setUserRole(user.role);  // Obtener el rol del usuario
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <header>
          <Nav isAuthenticated={isAuthenticated} userRole={userRole} />
        </header>
        <main>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register/:hash" element={<RegisterPage />} />
            <Route path="/schedules" element={<ScheduleList />} />
            <Route path="/view/:id" element={<ScheduleDetail />} />
            <Route path="/view-records" element={<RegisterList />} />
            <Route path="/employees" element={<EmployeeList />} />

            {/* Rutas protegidas */}
            {isAuthenticated && (
              <>
                
                
                <Route path="/" element={<EmployeeList />} />
                
              </>
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
