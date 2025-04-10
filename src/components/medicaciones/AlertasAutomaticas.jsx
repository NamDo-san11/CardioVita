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
                if (!med.hora) return;
    
                // Extraer hora, minuto y AM/PM
                const [horaMinuto, ampm] = med.hora.split(" ");
                const [horaStr, minutoStr] = horaMinuto.split(":");
                let hora = parseInt(horaStr, 10);
                const minuto = parseInt(minutoStr, 10);
    
                // Convertir a formato 24h
                if (ampm === "PM" && hora < 12) hora += 12;
                if (ampm === "AM" && hora === 12) hora = 0;
    
                const horaMed = new Date();
                horaMed.setHours(hora, minuto, 0, 0);
    
                const ahoraRedondeado = new Date();
                ahoraRedondeado.setSeconds(0, 0); // Ignoramos los segundos y milisegundos
    
                if (
                    horaMed.getTime() === ahoraRedondeado.getTime() &&
                    !med.tomado &&
                    fechaHoy >= med.fechaInicio &&
                    fechaHoy <= med.fechaFin
                ) {
                    setMedicacionPendiente(med);
                    setShow(true);
                }
            });
        }, 1000); // Verificamos cada segundo para mayor precisión
    
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
