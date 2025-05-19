import React, { useEffect, useState } from "react";
import { db } from "../../database/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, Container, Spinner, Alert } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const NotificacionPaciente = () => {
    const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        // Esperar a que se cargue el usuario
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.error("Usuario no autenticado");
                setLoading(false);
                return;
            }

            try {
                console.log("Usuario autenticado:", user.uid);

                const mensajesRef = collection(db, "mensajes_riesgo");

            const q = query(
                mensajesRef,
                where("uid", "==", user.uid)
            );

            const querySnapshot = await getDocs(q);

            const mensajesData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds); // ordena descendente

            setMensajes(mensajesData);

            } catch (error) {
                console.error("Error al obtener mensajes:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Container className="mt-4">
            <h3 className="mb-4">📝 Notificaciones del Profesional de Salud</h3>

            {loading ? (
                <Spinner animation="border" />
            ) : mensajes.length === 0 ? (
                <Alert variant="info">No tienes mensajes pendientes por el momento.</Alert>
            ) : (
                mensajes.map((msg) => (
                    <Card className="mb-3" key={msg.id}>
                        <Card.Body>
                            <Card.Title>Recomendación médica</Card.Title>
                            <Card.Text>{msg.mensaje}</Card.Text>
                            <hr />
                            <small className="text-muted">
                                Enviado por <strong>{msg.nombre || "Desconocido"}</strong> ({msg.correo || "sin correo"})<br />
                                el {msg.timestamp?.toDate().toLocaleString("es-ES", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </small>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default NotificacionPaciente;
