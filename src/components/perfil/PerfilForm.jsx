import React, { useRef } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";

const PerfilForm = ({ datos, onChange, onGuardar, onCancelar }) => {
  const inputFoto = useRef();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange("foto", reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      onChange(name, value);
    }
  };

  return (
    <Form className="shadow p-4 rounded bg-light">
      <Row className="mb-4 text-center">
        <Col>
          <Image
            src={datos.foto || "https://via.placeholder.com/120"}
            roundedCircle
            width={120}
            height={120}
            className="mb-2"
          />
          <Form.Control
            type="file"
            name="foto"
            accept="image/*"
            ref={inputFoto}
            onChange={handleInputChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={datos.nombre || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={datos.correo || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Peso (kg)</Form.Label>
            <Form.Control
              type="number"
              name="peso"
              value={datos.peso || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Estatura (m)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="estatura"
              value={datos.estatura || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="number"
              name="edad"
              value={datos.edad || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Enfermedades subyacentes</Form.Label>
        <Form.Control
          as="textarea"
          name="enfermedades"
          value={datos.enfermedades || ""}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Historial familiar de hipertensión</Form.Label>
        <Form.Select
          name="herencia"
          value={datos.herencia || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccione</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </Form.Select>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="success" onClick={onGuardar}>
          Guardar Cambios
        </Button>
      </div>
    </Form>
  );
};

export default PerfilForm;
