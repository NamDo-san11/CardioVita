import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionSintoma = ({
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteSintoma,
}) => {
    return (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            ¿Estás seguro que deseas eliminar este síntoma?
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteSintoma}>
            Eliminar
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionSintoma;
