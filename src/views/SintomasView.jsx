import { useState } from "react";
import Cuestionario from "../components/sintomas/Cuestionario";
import HistorialSintomas from "../components/sintomas/HistorialSintomas";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import "../styles/SintomasView.css"

const SintomasView = () => {
  const [editarDatos, setEditarDatos] = useState(null);
  const [mostrarCuestionario, setMostrarCuestionario] = useState(false);

  const handleNuevaEntrada = () => {
    setEditarDatos(null);
    setMostrarCuestionario(true);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
        <br />
          <h1 className="fw-bold text-primary">🩺 Registro de Síntomas</h1>
          <p className="text-muted">
            Lleva un control diario de tu estado físico y emocional.
          </p>
        </Col>
      </Row>

      {mostrarCuestionario || editarDatos ? (
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow p-4">
              <Card.Body>
                <Cuestionario
                  datosIniciales={editarDatos}
                  onFinish={() => {
                    setEditarDatos(null);
                    setMostrarCuestionario(false);
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="mb-3 text-center">
            <Col>
              <Button variant="success" onClick={handleNuevaEntrada}>
                <Plus className="me-2" /> Agregar Nuevo Registro
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <HistorialSintomas
                onEdit={(item) => {
                  setEditarDatos(item);
                  setMostrarCuestionario(true);
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default SintomasView;
