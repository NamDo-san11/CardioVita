import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalPresion = ({ show, onHide, onGuardar }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState("08:00");
  const [sistolica, setSistolica] = useState(120);
  const [diastolica, setDiastolica] = useState(80);

  const calcularRango = () => {
    if (sistolica < 90 || diastolica < 60) return "Baja";
    if (sistolica < 120 && diastolica < 80) return "Normal";
    if (sistolica >= 120 && sistolica <= 129 && diastolica < 80) return "Elevada";
    if ((sistolica >= 130 && sistolica <= 139) || (diastolica >= 80 && diastolica <= 89)) return "Alta (Etapa 1)";
    if (sistolica >= 140 || diastolica >= 90) return "Alta (Etapa 2)";
    return "Indefinido";
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
            <span className={`badge ${
              calcularRango().includes("Baja") ? "bg-primary" :
              calcularRango().includes("Normal") ? "bg-success" :
              calcularRango().includes("Elevada") ? "bg-warning text-dark" :
              "bg-danger"
            }`}>
              Tu Rango: {calcularRango()}
          </span>
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