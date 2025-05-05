import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const PasoDatosDoctor = ({ datos, handleChange, setBotonActivo }) => {
  const [cedulaValida, setCedulaValida] = useState(true);

  // Validar y formatear automáticamente
  const handleCedulaChange = (e) => {
    let value = e.target.value.replace(/[^\dA-Za-z]/g, ""); // Solo dígitos y letras
    if (value.length >= 3 && value.length <= 15) {
      // Insertar guiones
      value = value
        .replace(/^(\d{3})(\d{0,8})/, "$1-$2")
        .replace(/^(\d{3}-\d{6,8})(\d{0,4}[A-Za-z]?)$/, "$1-$2");
    }

    handleChange("cedula", value);

    // Validar formato completo
    const regex = /^\d{3}-\d{6,8}-\d{4}[A-Z]?$/;
    setCedulaValida(regex.test(value));
  };

  // Desactivar botón si está inválido
  useEffect(() => {
    const camposRequeridos = [
      "especialidad",
      "colegiacion",
      "cedula",
      "experiencia",
      "centroTrabajo",
    ];
    const todosLlenos = camposRequeridos.every((campo) => datos[campo]?.trim() !== "");
    const cedulaCorrecta = /^\d{3}-\d{6,8}-\d{4}[A-Z]?$/.test(datos.cedula || "");
    setBotonActivo(todosLlenos && cedulaCorrecta);
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
          value={datos.cedula || ""}
          onChange={handleCedulaChange}
          placeholder="Ej. 001-090789-1234Z"
          isInvalid={!cedulaValida && datos.cedula?.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">
          Formato inválido. Ejemplo válido: <strong>001-090789-1234Z</strong>
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
