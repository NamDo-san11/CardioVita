import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import PasoDatosUsuario from "./PasoDatosUsuario";
import PasoDatosDoctor from "./PasoDatosDoctor";

const Paso2 = ({ datos, onChange, onGuardar, onBack }) => {
  const [botonActivo, setBotonActivo] = useState(false);

  const handleChange = (name, value) => {
    onChange(name, value);
  };

  return (
    <Form>
      {datos.rol.toLowerCase() === "usuario" ? (
  <PasoDatosUsuario
    datos={datos}
    handleChange={handleChange}
    setBotonActivo={setBotonActivo} 
  />
) : (
  <PasoDatosDoctor
    datos={datos}
    handleChange={handleChange}
    setBotonActivo={setBotonActivo} 
  />
)}

      <div className="d-flex justify-content-between mt-3">
        <Button variant="secondary" onClick={onBack}>Volver</Button>
        <Button variant="success" onClick={onGuardar} disabled={!botonActivo}>
          Crear Cuenta
        </Button>
      </div>
    </Form>
  );
};

export default Paso2;
