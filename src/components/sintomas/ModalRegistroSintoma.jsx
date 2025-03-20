import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroSintoma = ({
    showModal,
    setShowModal,
    nuevoSintoma,
    handleInputChange,
    handleAddSintoma,
    }) => {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Agregar Síntoma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Nombre del Síntoma</Form.Label>
                <Form.Control
                type="text"
                name="nombre"
                value={nuevoSintoma.nombre}
                onChange={handleInputChange}
                placeholder="Ingresa el nombre del síntoma"
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={nuevoSintoma.descripcion}
                onChange={handleInputChange}
                placeholder="Ingresa la descripción"
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddSintoma}>
            Guardar
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroSintoma;
