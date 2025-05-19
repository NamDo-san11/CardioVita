// src/components/alertasriesgo/EnviarMensaje.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import {
    collection,
    addDoc,
    Timestamp,
    doc,
    getDoc,
    } from "firebase/firestore";
    import { useAuth } from "../../database/authcontext";

    const EnviarMensaje = ({ show, onClose, paciente }) => {
    const [mensaje, setMensaje] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [rol, setRol] = useState(null);
    const { user } = useAuth();

    // Obtener el rol del usuario autenticado
    useEffect(() => {
        const obtenerRolUsuario = async () => {
        if (user?.uid) {
            try {
            const ref = doc(db, "usuarios", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const datos = snap.data();
                setRol(datos.rol?.toLowerCase() || null);
            } else {
                console.warn("No se encontró el documento del usuario.");
            }
            } catch (error) {
            console.error("Error al obtener el rol:", error);
            }
        }
        };

        obtenerRolUsuario();
    }, [user]);

    // Validación y envío del mensaje
        const handleEnviarMensaje = async () => {
        if (rol !== "doctor") {
            alert("❌ Solo los doctores pueden enviar mensajes.");
            return;
        }

        if (!mensaje.trim()) {
            alert("❌ El mensaje no puede estar vacío.");
            return;
        }

        if (
            !paciente ||
            !paciente.uid ||
            !paciente.nombre ||
            !paciente.correo
        ) {
            alert("❌ Los datos del paciente no están completos.");
            return;
        }

        if (!user?.uid || !user?.email) {
            alert("❌ Datos del doctor incompletos.");
            return;
        }

        setEnviando(true);
        try {
            const mensajeData = {
            uidPaciente: paciente.uid,
            nombrePaciente: paciente.nombre,
            correoPaciente: paciente.correo,
            mensaje: mensaje.trim(),
            enviadoPorUid: user.uid,
            enviadoPorEmail: user.email,
            timestamp: Timestamp.now(),
            };

            console.log("Mensaje a guardar en Firestore:", mensajeData); // depuración

            await addDoc(collection(db, "mensajes_riesgo"), mensajeData);

            setMensaje("");
            alert("✅ Mensaje enviado correctamente.");
            onClose();
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
            alert("❌ Hubo un error al enviar el mensaje.");
        } finally {
            setEnviando(false);
        }
    };


    return (
        <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>
            {paciente
                ? `Enviar mensaje a ${paciente.nombre}`
                : "Enviar mensaje"}
            </Modal.Title>
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
                disabled={enviando}
                />
            </Form.Group>
            </Form>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="outline-secondary" onClick={onClose} disabled={enviando}>
            Cancelar
            </Button>
            <Button
            variant="primary"
            onClick={handleEnviarMensaje}
            disabled={enviando || !mensaje.trim() || rol !== "doctor"}
            >
            {enviando ? "Enviando..." : "Enviar"}
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default EnviarMensaje;
