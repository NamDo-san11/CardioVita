import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './views/Login'
import Encabezado from "./components/Encabezado";
import Inicio from "./views/Inicio";
import SintomasView from "./views/SintomasView";
import HeartRateMonitor from "./views/HeartRateMonitor";
import PresionArterialView from "./views/PresionArterialView";
import AlertasMedicacion from "./views/AlertasMedicacion";

import './App.css'

function App() {
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
              </Routes>
            </main>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App