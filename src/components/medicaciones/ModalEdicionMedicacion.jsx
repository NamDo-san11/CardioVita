import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAuth } from "firebase/auth";

const ModalEdicionMedicacion = ({ show, onHide, datos, onGuardar }) => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    const [formData, setFormData] = useState({
        nombre: "",
        hora: "",
        tomado: false,
        pospuesto: false,
        fechaInicio: "",
        fechaFin: "",
        uid: uid || "",
    });

    useEffect(() => {
        if (datos) {
        setFormData({
            ...datos,
            uid: uid || datos.uid || "",
        });
        }
    }, [datos, uid]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = () => {
        onGuardar(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Editar Medicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTomado">
                <Form.Check
                    type="checkbox"
                    name="tomado"
                    checked={formData.tomado}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                            ...prev,
                            tomado: checked,
                            pospuesto: checked ? false : prev.pospuesto, // desactiva pospuesto si se activa tomado
                        }));
                    }}
                    label="Tomado"
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPospuesto">
                <Form.Check
                    type="checkbox"
                    name="pospuesto"
                    checked={formData.pospuesto}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                            ...prev,
                            pospuesto: checked,
                            tomado: checked ? false : prev.tomado, // desactiva tomado si se activa pospuesto
                        }));
                    }}
                    label="Pospuesto"
                />
            </Form.Group>

            
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
            Guardar Cambios
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionMedicacion;