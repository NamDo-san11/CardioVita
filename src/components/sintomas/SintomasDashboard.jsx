import { useState } from "react";
import Cuestionario from "../components/sintomas/Cuestionario";
import HistorialSintomas from "../components/sintomas/HistorialSintomas";

const SintomasDashboard = () => {
    const [editarDatos, setEditarDatos] = useState(null);

    return (
        <div className="container mt-4">
        <h1>Gestión de Síntomas</h1>
        {editarDatos ? (    
            <Cuestionario datosIniciales={editarDatos} onFinish={() => setEditarDatos(null)} />
        ) : (
            <HistorialSintomas onEdit={setEditarDatos} />
        )}
        </div>
    );
};

export default SintomasDashboard;
