import { useState,useEffect } from "react";
import Cuestionario from "../components/sintomas/Cuestionario";
import HistorialSintomas from "../components/sintomas/HistorialSintomas";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import  ReactGA  from "react-ga4";
import "../styles/SintomasView.css"

const SintomasView = () => {
  const [editarDatos, setEditarDatos] = useState(null);
  const [mostrarCuestionario, setMostrarCuestionario] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  //  ? Persitencia de datos notificacion
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  useEffect(() => {
    // ?Iniciar Analityc la app
    ReactGA.initialize("G-ZPQ0YG91K6");
  
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
      title: 'SintomasView.jsx'
    })
  }, []);
  
  const handleNuevaEntrada = () => {
    setEditarDatos(null);
    setMostrarCuestionario(true);
  };

  return (

    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
        <br />
          <h1 className="fw-bold text-edit">🩺 Registro de Síntomas</h1>
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
