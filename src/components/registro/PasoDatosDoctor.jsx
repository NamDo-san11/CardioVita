import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "../../styles/PasoDatosDoctor.css"

const PasoDatosDoctor = ({ datos, handleChange, setBotonActivo }) => {
  const [touchedCedula, setTouchedCedula] = useState(false);

  const formatearCedula = (valor) => {
    const limpio = valor.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();
    let formateado = limpio;

    if (limpio.length > 3 && limpio.length <= 9) {
      formateado = `${limpio.slice(0, 3)}-${limpio.slice(3)}`;
    } else if (limpio.length > 9 && limpio.length <= 13) {
      formateado = `${limpio.slice(0, 3)}-${limpio.slice(3, 9)}-${limpio.slice(9)}`;
    } else if (limpio.length > 13) {
      formateado = `${limpio.slice(0, 3)}-${limpio.slice(3, 9)}-${limpio.slice(9, 13)}${limpio.slice(13, 14)}`;
    }

    return formateado;
  };

  const handleCedulaChange = (e) => {
    const formateado = formatearCedula(e.target.value);
    handleChange("cedula", formateado);
  };

  const regexCedula = /^\d{3}-\d{6,8}-\d{4}[A-Z]$/;
  const esCedulaValida = regexCedula.test(datos.cedula || "");

  useEffect(() => {
    const camposRequeridos = [
      "especialidad",
      "colegiacion",
      "cedula",
      "experiencia",
      "centroTrabajo",
    ];
    const todosLlenos = camposRequeridos.every((campo) => datos[campo]?.trim() !== "");
    setBotonActivo(todosLlenos && esCedulaValida);
  }, [datos, setBotonActivo]);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label><strong>Especialidad médica</strong></Form.Label>
        <Form.Control
          type="text"
          name="especialidad"
          value={datos.especialidad || ""}
          onChange={(e) => handleChange("especialidad", e.target.value)}
          placeholder="Ej. Cardiología"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>Número de colegiación</strong></Form.Label>
        <Form.Control
          type="text"
          name="colegiacion"
          value={datos.colegiacion || ""}
          onChange={(e) => handleChange("colegiacion", e.target.value)}
          placeholder="Ej. 123456"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>Cédula</strong></Form.Label>
        <Form.Control
          type="text"
          name="cedula"
          placeholder="Ej. 123-123456-1000F"
          value={datos.cedula || ""}
          onChange={handleCedulaChange}
          onBlur={() => setTouchedCedula(true)}
          isInvalid={touchedCedula && datos.cedula?.length >= 18 && !esCedulaValida}
          maxLength={18}
          required
        />
        <Form.Control.Feedback type="invalid">
          Cédula inválida. Formato: 123-123456-1000F
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>Experiencia (años)</strong></Form.Label>
        <Form.Control
          type="number"
          name="experiencia"
          value={datos.experiencia || ""}
          onChange={(e) => handleChange("experiencia", e.target.value)}
          min="0"
          placeholder="Ej. 5"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>Hospital o Clínica</strong></Form.Label>
        <Form.Control
          type="text"
          name="centroTrabajo"
          value={datos.centroTrabajo || ""}
          onChange={(e) => handleChange("centroTrabajo", e.target.value)}
          placeholder="Ej. Clínica Familiar Juigalpa"
          required
        />
      </Form.Group>
    </>
  );
};

export default PasoDatosDoctor;
