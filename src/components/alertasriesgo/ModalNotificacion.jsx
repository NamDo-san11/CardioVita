import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const ModalNotificacion = ({ show, onClose, pacientesEnRiesgo }) => {
    const [showMensajeModal, setShowMensajeModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    const handleEnviarMensaje = async () => {
        if (!mensaje.trim() || !pacienteSeleccionado) return;

        try {
            await addDoc(collection(db, "mensajes_riesgo"), {
                uid: pacienteSeleccionado.uid,
                nombre: pacienteSeleccionado.nombre,
                correo: pacienteSeleccionado.correo,
                mensaje,
                timestamp: Timestamp.now()
            });

            setMensaje("");
            setShowMensajeModal(false);
            alert("Mensaje enviado correctamente.");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            alert("Hubo un error al enviar el mensaje.");
        }
    };

    const abrirModalMensaje = (paciente) => {
        setPacienteSeleccionado(paciente);
        setShowMensajeModal(true);
    };

    return (
        <>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>⚠️ Alerta de Riesgo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Se han detectado pacientes con presión arterial fuera de rango (Frecuencia Alta):</p>
                    <ul>
                        {pacientesEnRiesgo.map((p, i) => (
                            <li key={i} className="mb-2">
                                <strong>{p.nombre}</strong> - {p.correo}
                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                    className="ms-2"
                                    onClick={() => abrirModalMensaje(p)}
                                >
                                    Enviar mensaje
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <p className="text-danger">Por favor, tome acción inmediata si es necesario.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal interno para enviar mensaje */}
            <Modal
                show={showMensajeModal}
                onHide={() => setShowMensajeModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Enviar mensaje a {pacienteSeleccionado?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="mensajeDoctor">
                            <Form.Label>Mensaje para el paciente:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Ej: Le recomendamos acudir a urgencias si persiste el malestar..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMensajeModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleEnviarMensaje}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalNotificacion;
