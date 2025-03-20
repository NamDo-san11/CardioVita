import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionSintoma = ({
    showEditModal,
    setShowEditModal,
    sintomaEditado,
    handleEditInputChange,
    handleEditSintoma,
    }) => {
    if (!sintomaEditado) return null;

    return (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Editar Síntoma</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                type="text"
                name="nombre"
                value={sintomaEditado.nombre}
                onChange={handleEditInputChange}
                placeholder="Editar nombre del síntoma"
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={sintomaEditado.descripcion}
                onChange={handleEditInputChange}
                placeholder="Editar descripción"
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleEditSintoma}>
            Actualizar
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionSintoma;
