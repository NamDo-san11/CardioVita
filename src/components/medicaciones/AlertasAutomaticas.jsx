import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { db } from "../../database/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";

const AlertasAutomaticas = ({ medicaciones }) => {
    const [medicacionPendiente, setMedicacionPendiente] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const intervalo = setInterval(() => {
            const ahora = new Date();
            const fechaHoy = ahora.toISOString().split("T")[0];

            medicaciones.forEach((med) => {
                const [hora, minuto] = med.hora.split(":").map(Number);
                const horaMed = new Date();
                horaMed.setHours(hora, minuto, 0, 0);

                const diferencia = Math.abs(horaMed - ahora);

                if (
                    diferencia < 60000 &&
                    !med.tomado &&
                    fechaHoy >= med.fechaInicio &&
                    fechaHoy <= med.fechaFin
                ) {
                    setMedicacionPendiente(med);
                    setShow(true);
                }
            });
        }, 30000);

        return () => clearInterval(intervalo);
    }, [medicaciones]);

    const handleClose = () => setShow(false);

    const marcarComoTomado = async () => {
        if (!medicacionPendiente?.id) return;
        try {
            const ref = doc(db, "medicaciones", medicacionPendiente.id);
            await updateDoc(ref, { tomado: true });
            setShow(false);
        } catch (error) {
            console.error("Error al marcar como tomado:", error);
        }
    };

    const marcarComoPospuesto = async () => {
        if (!medicacionPendiente?.id) return;
        try {
            const ref = doc(db, "medicaciones", medicacionPendiente.id);
            await updateDoc(ref, { pospuesto: true });
            setShow(false);
        } catch (error) {
            console.error("Error al marcar como pospuesto:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>⏰ Recordatorio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {medicacionPendiente && (
                    <p>
                        ¡Es hora de tomar:{" "}
                        <strong>{medicacionPendiente.nombre}</strong>!
                    </p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={marcarComoTomado}>
                    Tomado 😊
                </Button>
                <Button variant="warning" onClick={marcarComoPospuesto}>
                    Pospuesto ⏰
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlertasAutomaticas;
