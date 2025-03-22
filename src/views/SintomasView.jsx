import { useState } from "react";
import Cuestionario from "../components/sintomas/Cuestionario";
import HistorialSintomas from "../components/sintomas/HistorialSintomas";

const SintomasView = () => {
  const [editarDatos, setEditarDatos] = useState(null);
  const [mostrarCuestionario, setMostrarCuestionario] = useState(false);

  const handleNuevaEntrada = () => {
    setEditarDatos(null);
    setMostrarCuestionario(true);
  };

  return (
    <div className="container mt-4">
        <br />
        <br />
      <h1>Registro de Síntomas</h1>
      {mostrarCuestionario || editarDatos ? (
        <Cuestionario
          datosIniciales={editarDatos}
          onFinish={() => {
            setEditarDatos(null);
            setMostrarCuestionario(false);
          }}
        />
      ) : (
        <>
          <button className="btn btn-success mb-3" onClick={handleNuevaEntrada}>
            + Agregar Registro
          </button>
          <HistorialSintomas onEdit={(item) => {
            setEditarDatos(item);
            setMostrarCuestionario(true);
          }} />
        </>
      )}
    </div>
  );
};

export default SintomasView;
