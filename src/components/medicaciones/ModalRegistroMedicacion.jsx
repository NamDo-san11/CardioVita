import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../database/firebaseconfig";

const ModalRegistroMedicacion = ({ show, onHide, onMedicacionAgregada }) => {
    const [nombre, setNombre] = useState("");
    const [hora, setHora] = useState("");
    const [diasDuracion, setDiasDuracion] = useState(1);
    const [errores, setErrores] = useState({});

    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    const handleGuardar = async () => {
        const nuevosErrores = {};
        if (!nombre.trim()) nuevosErrores.nombre = "El nombre es requerido.";
        if (!hora) nuevosErrores.hora = "La hora es requerida.";
        if (diasDuracion <= 0) nuevosErrores.diasDuracion = "Debe ser al menos 1 día.";

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        const hoy = new Date();
        const fechaInicio = hoy.getFullYear() + "-" + 
            String(hoy.getMonth() + 1).padStart(2, "0") + "-" + 
            String(hoy.getDate()).padStart(2, "0");

        const fechaFinDate = new Date(hoy);
        fechaFinDate.setDate(hoy.getDate() + parseInt(diasDuracion) - 1);
        const fechaFin = fechaFinDate.getFullYear() + "-" + 
            String(fechaFinDate.getMonth() + 1).padStart(2, "0") + "-" + 
            String(fechaFinDate.getDate()).padStart(2, "0");

        const nuevaMed = {
            uid,
            nombre,
            hora,
            tomado: false,
            pospuesto: false,
            fechaInicio,
            fechaFin,
        };

        try {
            const docRef = await addDoc(collection(db, "medicaciones"), nuevaMed);
            if (onMedicacionAgregada) {
                onMedicacionAgregada({ ...nuevaMed, id: docRef.id });
            }
            setNombre("");
            setHora("");
            setDiasDuracion(1);
            setErrores({});
            onHide();
        } catch (error) {
            console.error("Error al agregar medicación:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>💊 Registrar Medicación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Medicamento</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. Ibuprofeno"
                            isInvalid={!!errores.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.nombre}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hora de Toma</Form.Label>
                        <Form.Control
                            type="time"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            isInvalid={!!errores.hora}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hora}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Días de duración</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={diasDuracion}
                            onChange={(e) => setDiasDuracion(e.target.value)}
                            isInvalid={!!errores.diasDuracion}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.diasDuracion}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleGuardar}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroMedicacion;
