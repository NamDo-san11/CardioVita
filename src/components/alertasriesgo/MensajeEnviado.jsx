// src/components/alertasriesgo/MensajeEnviado.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const MensajeEnviado = ({ show, onClose, exito }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{exito ? "Mensaje Enviado" : "Error al Enviar"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {exito ? (
                    <p>El mensaje fue enviado exitosamente al paciente.</p>
                ) : (
                    <p>Hubo un error al intentar enviar el mensaje. Por favor, intente nuevamente.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MensajeEnviado;
