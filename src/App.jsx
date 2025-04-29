import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './views/Login';
import Encabezado from "./components/Encabezado";
import Inicio from "./views/Inicio";
import SintomasView from "./views/SintomasView";
import HeartRateMonitor from "./views/HeartRateMonitor";
import PresionArterialView from "./views/PresionArterialView";
import AlertasMedicacion from "./views/AlertasMedicacion";
import EducacionView from "./views/EducacionView";  

import ReactGA from "react-ga4";
import './App.css';
import { useEffect } from "react";

function App() {

  useEffect(() => {
    ReactGA.initialize("G-ZPQ0YG91K6");
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
      title: 'App.jsx'
    });
  }, []);

  return (
    <>
      <AuthProvider>
        <Router>
          <Encabezado />
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/inicio" element={<ProtectedRoute element={<Inicio />} />} />
              <Route path="/sintomas" element={<ProtectedRoute element={<SintomasView />} />} />
              <Route path="/corazon" element={<ProtectedRoute element={<HeartRateMonitor />} />} />
              <Route path="/presion" element={<ProtectedRoute element={<PresionArterialView />} />} />
              <Route path="/alertasmedicacion" element={<ProtectedRoute element={<AlertasMedicacion />} />} />
              <Route path="/educacion" element={<ProtectedRoute element={<EducacionView />} />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
