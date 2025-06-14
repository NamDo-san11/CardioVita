import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import MensajeEnviado from "./MensajeEnviado"; // Asegúrate que la ruta sea correcta

const ModalNotificacion = ({ show, onClose, pacientesEnRiesgo }) => {
    const [showMensajeModal, setShowMensajeModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [exitoEnvio, setExitoEnvio] = useState(true); // Nuevo estado para éxito/error

    const handleEnviarMensaje = async () => {
        if (!mensaje.trim() || !pacienteSeleccionado) return;

        try {
            const auth = getAuth();
            const doctor = auth.currentUser;

            const usuariosRef = collection(db, "usuarios");
            const q = query(usuariosRef, where("uid", "==", doctor.uid));
            const querySnapshot = await getDocs(q);

            let nombreDoctor = "Profesional de salud desconocido";
            let correoDoctor = doctor.email || "sin correo";

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data();
                nombreDoctor = docData.nombre || nombreDoctor;
                correoDoctor = docData.correo || correoDoctor;
            }

            await addDoc(collection(db, "mensajes_riesgo"), {
                uid: pacienteSeleccionado.uid,
                nombre: nombreDoctor,
                correo: correoDoctor,
                mensaje,
                timestamp: Timestamp.now(),
            });

            setMensaje("");
            setShowMensajeModal(false);
            setExitoEnvio(true);
            setShowConfirmModal(true);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            setExitoEnvio(false);
            setShowMensajeModal(false);
            setShowConfirmModal(true);
        }
    };

    const abrirModalMensaje = (paciente) => {
        setPacienteSeleccionado(paciente);
        setShowMensajeModal(true);
    };

    return (
        <>
            {/* Modal principal */}
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
                    <Button variant="outline-secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para redactar y enviar mensaje */}
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
                    <Button variant="outline-secondary" onClick={() => setShowMensajeModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="outline-success" onClick={handleEnviarMensaje}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación o error */}
            <MensajeEnviado
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                exito={exitoEnvio}
            />
        </>
    );
};

export default ModalNotificacion;
