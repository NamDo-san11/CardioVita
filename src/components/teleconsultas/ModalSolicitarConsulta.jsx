import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const ModalSolicitarConsulta = ({ show, onClose, doctor, onEnviar }) => {
  if (!doctor) return null; // ✅ Evita error si doctor es null

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleEnviar = () => {
    if (!mensaje.trim()) {
      setError("Debes escribir el motivo de tu consulta.");
      return;
    }

    onEnviar({ mensaje });
    setMensaje("");
    setError("");
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Solicitar Teleconsulta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Doctor seleccionado: <strong>{doctor.nombre}</strong>
        </p>
        <Form.Group className="mb-3">
          <Form.Label>Motivo de la consulta</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Describe tus síntomas o inquietud médica"
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEnviar}>
          Enviar solicitud
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSolicitarConsulta;
