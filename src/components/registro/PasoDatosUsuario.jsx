import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "../../styles/PasoDatosUsuario.css"

const PasoDatosUsuario = ({ datos, handleChange, setBotonActivo }) => {
  const [errores, setErrores] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  useEffect(() => {
    const pesoValido = !isNaN(datos.peso) && datos.peso > 20 && datos.peso < 250;
    const estaturaValida = !isNaN(datos.estatura) && datos.estatura > 0.5 && datos.estatura < 2.5;
    const edadValida = !isNaN(datos.edad) && datos.edad > 0 && datos.edad < 120;
    const herenciaValida = datos.herencia === "si" || datos.herencia === "no";

    setErrores({
      peso: !pesoValido,
      estatura: !estaturaValida,
      edad: !edadValida,
    });

    setBotonActivo(pesoValido && estaturaValida && edadValida && herenciaValida);
  }, [datos, setBotonActivo]);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Peso (kg)</Form.Label>
        <Form.Control
          type="number"
          name="peso"
          min="20"
          max="250"
          step="0.1"
          value={datos.peso || ""}
          onChange={handleInputChange}
          isInvalid={errores.peso}
          placeholder="Ej. 70"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Estatura (m)</Form.Label>
        <Form.Control
          type="number"
          name="estatura"
          min="0.5"
          max="2.5"
          step="0.01"
          value={datos.estatura || ""}
          onChange={handleInputChange}
          isInvalid={errores.estatura}
          placeholder="Ej. 1.75"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Edad</Form.Label>
        <Form.Control
          type="number"
          name="edad"
          min="1"
          max="120"
          value={datos.edad || ""}
          onChange={handleInputChange}
          isInvalid={errores.edad}
          placeholder="Ej. 25"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Enfermedades subyacentes</Form.Label>
        <Form.Control
          as="textarea"
          name="enfermedades"
          value={datos.enfermedades || ""}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Historial familiar de hipertensión</Form.Label>
        <Form.Select
          name="herencia"
          value={datos.herencia || ""}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </Form.Select>
      </Form.Group>
    </>
  );
};


export default PasoDatosUsuario;
