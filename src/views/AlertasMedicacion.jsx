import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, ListGroup } from "react-bootstrap";

const AlertasMedicacion = () => {
    const [medicaciones, setMedicaciones] = useState([]);
    const [nombreMed, setNombreMed] = useState("");
    const [horaMed, setHoraMed] = useState("");
    const [diasDuracion, setDiasDuracion] = useState(1);

    useEffect(() => {
        const intervalo = setInterval(() => {
        const ahora = new Date();
        const horaActual = ahora.toTimeString().slice(0, 5);
        const fechaHoy = ahora.toISOString().split('T')[0];

        medicaciones.forEach((med) => {
            if (
            med.hora === horaActual &&
            !med.tomado &&
            fechaHoy >= med.fechaInicio &&
            fechaHoy <= med.fechaFin
            ) {
            alert(`¡Es hora de tomar: ${med.nombre}!`);
            }
        });
        }, 60000);

        return () => clearInterval(intervalo);
    }, [medicaciones]);

    const agregarMedicacion = () => {
        if (nombreMed && horaMed && diasDuracion > 0) {
        const hoy = new Date();
        const fechaInicio = hoy.toISOString().split('T')[0];
        const fechaFin = new Date(hoy);
        fechaFin.setDate(hoy.getDate() + parseInt(diasDuracion) - 1);

        const nuevaMed = {
            nombre: nombreMed,
            hora: horaMed,
            tomado: false,
            pospuesto: false,
            fechaInicio,
            fechaFin: fechaFin.toISOString().split('T')[0],
        };
        setMedicaciones([...medicaciones, nuevaMed]);
        setNombreMed("");
        setHoraMed("");
        setDiasDuracion(1);
        }
    };

    const marcarComoTomada = (index) => {
        const actualizadas = [...medicaciones];
        actualizadas[index].tomado = true;
        setMedicaciones(actualizadas);
    };

    const posponerDosis = (index) => {
        const actualizadas = [...medicaciones];
        const nuevaHora = sumarMinutos(actualizadas[index].hora, 10);
        actualizadas[index].hora = nuevaHora;
        actualizadas[index].pospuesto = true;
        setMedicaciones(actualizadas);
    };

    const eliminarMedicacion = (index) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta medicación?");
        if (confirmacion) {
        const actualizadas = medicaciones.filter((_, i) => i !== index);
        setMedicaciones(actualizadas);
        }
    };

    const sumarMinutos = (hora, minutos) => {
        const [h, m] = hora.split(":").map(Number);
        const nuevaFecha = new Date();
        nuevaFecha.setHours(h, m + minutos);
        return nuevaFecha.toTimeString().slice(0, 5);
    };

    return (
        <Container style={{ marginTop: "100px" }}>
        <Row className="justify-content-center">
            <Col md={8}>
            <Card className="shadow p-4">
                <h2 className="text-center mb-4">💊 Alertas de Medicación</h2>
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre del Medicamento</Form.Label>
                    <Form.Control
                    type="text"
                    value={nombreMed}
                    onChange={(e) => setNombreMed(e.target.value)}
                    placeholder="Ej. Paracetamol"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Hora de Toma</Form.Label>
                    <Form.Control
                    type="time"
                    value={horaMed}
                    onChange={(e) => setHoraMed(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Días de duración</Form.Label>
                    <Form.Control
                    type="number"
                    min="1"
                    value={diasDuracion}
                    onChange={(e) => setDiasDuracion(e.target.value)}
                    placeholder="Ej. 5 días"
                    />
                </Form.Group>
                <Button variant="primary" onClick={agregarMedicacion}>
                    Agregar Medicación
                </Button>
                </Form>
            </Card>

            {medicaciones.length > 0 && (
                <Card className="mt-4 shadow">
                <Card.Body>
                    <h4>📋 Medicaciones Programadas</h4>
                    <ListGroup>
                    {medicaciones.map((med, index) => (
                        <ListGroup.Item key={index}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                            <strong>{med.nombre}</strong> a las{" "}
                            <strong>{med.hora}</strong><br />
                            <small>
                                Del <strong>{med.fechaInicio}</strong> al <strong>{med.fechaFin}</strong>
                            </small><br />
                            {med.tomado ? (
                                <span className="text-success">Tomado</span>
                            ) : (
                                <>
                                <Button
                                    size="sm"
                                    variant="success"
                                    className="me-2"
                                    onClick={() => marcarComoTomada(index)}
                                >
                                    Tomado
                                </Button>
                                <Button
                                    size="sm"
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => posponerDosis(index)}
                                >
                                    Posponer
                                </Button>
                                </>
                            )}
                            </div>
                            <Button
                            size="sm"
                            variant="danger"
                            onClick={() => eliminarMedicacion(index)}
                            >
                            Eliminar
                            </Button>
                        </div>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                </Card.Body>
                </Card>
            )}
            </Col>
        </Row>
        </Container>
    );
};

export default AlertasMedicacion;
