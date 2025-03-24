import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './views/Login'
import Encabezado from "./components/Encabezado";
import Inicio from "./views/Inicio";
import SintomasView from "./views/SintomasView";
import HeartRateMonitor from "./views/HeartRateMonitor ";

import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <div className="App">
            <Encabezado />
            <main>
              <Routes>
                
                <Route path="/" element={<Login />} />
                <Route path="/inicio" element={<ProtectedRoute element={<Inicio />} />} />
                <Route path="/sintomas" element={<ProtectedRoute element={<SintomasView />} />} />
                <Route pat="/cardio" element={<ProtectedRoute element={<HeartRateMonitor/>}/>}/>
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App