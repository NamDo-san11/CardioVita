import React from "react";
import { Card, Button, Row, Col, Image } from "react-bootstrap";
import "../../styles/PerfilUsuarioCard.css";

const PerfilUsuarioCard = ({ usuario, onVerMas, onFrecuencia }) => {
    return (
        <Card className="perfil-card p-4">
        <Row className="align-items-center">
            <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
            <Image
                src={usuario.foto || "/default-avatar.png"}
                roundedCircle
                width={90}
                height={90}
                className="mb-2"
            />
            <h6 className="mb-0">{usuario.nombre || "Nombre Usuario"}</h6>
            <small className="text-muted">{usuario.rol === "doctor" ? "Médico" : "Usuario"}</small>
            </Col>

            <Col xs={12} md={6} className="text-center text-md-start">
            <p className="mb-1">
                <strong>De:</strong> {usuario.ciudad || "No especificado"}
            </p>
            {usuario.rol === "usuario" ? (
                <>
                <p className="mb-1"><strong>Pesa:</strong> {usuario.peso || "N/D"} kg</p>
                <p className="mb-1"><strong>Diagnóstico:</strong> {usuario.enfermedades || "Ninguno"}</p>
                </>
            ) : (
                <>
                <p className="mb-1"><strong>Especialidad:</strong> {usuario.especialidad || "N/D"}</p>
                <p className="mb-1"><strong>Centro:</strong> {usuario.centroTrabajo || "N/D"}</p>
                </>
            )}
            </Col>

            <Col xs={12} md={3} className="text-center text-md-end mt-3 mt-md-0">
            <Button variant="outline-secondary" size="sm" className="me-2" onClick={onVerMas}>
                Más información
            </Button>
            {usuario.rol === "usuario" && (
                <Button variant="primary" size="sm" onClick={onFrecuencia}>
                Frecuencia cardíaca
                </Button>
            )}
            </Col>
        </Row>
        </Card>
    );
};

export default PerfilUsuarioCard;
