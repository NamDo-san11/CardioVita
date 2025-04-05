import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalPresion = ({ show, onHide, onGuardar }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState("08:00");
  const [sistolica, setSistolica] = useState(120);
  const [diastolica, setDiastolica] = useState(80);

  const calcularRango = () => {
    if (sistolica < 120 && diastolica < 80) return "Normal";
    if (sistolica <= 129 && diastolica < 80) return "Elevada";
    return "Alta";
  };

  const handleSubmit = () => {
    const datos = {
      fecha,
      hora,
      sistolica,
      diastolica,
      rango: calcularRango(),
    };
    onGuardar(datos);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Añadir Presión Arterial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Label>Sistólica</Form.Label>
              <Form.Control type="number" min="90" max="180" value={sistolica} onChange={(e) => setSistolica(parseInt(e.target.value))} />
            </Col>
            <Col>
              <Form.Label>Diastólica</Form.Label>
              <Form.Control type="number" min="60" max="120" value={diastolica} onChange={(e) => setDiastolica(parseInt(e.target.value))} />
            </Col>
          </Row>

          <div className="text-end">
            <span className="badge bg-info">Tu Rango: {calcularRango()}</span>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Cancelar</Button>
        <Button variant="outline-success" onClick={handleSubmit}>Agregar Datos</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPresion;