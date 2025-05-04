import { Form } from "react-bootstrap";

const PasoDatosUsuario = ({ datos, handleChange }) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Peso (kg)</Form.Label>
        <Form.Control
          type="number"
          name="peso"
          value={datos.peso || ""}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Estatura (m)</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="estatura"
          value={datos.estatura || ""}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Edad</Form.Label>
        <Form.Control
          type="number"
          name="edad"
          value={datos.edad || ""}
          onChange={handleChange}
          required
        />
      </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Enfermedades subyacentes</Form.Label>
        <Form.Control
          as="textarea"
          name="enfermedades"
          value={datos.enfermedades || ""}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Historial familiar de hipertensión</Form.Label>
        <Form.Select
          name="herencia"
          value={datos.herencia || ""}
          onChange={handleChange}
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