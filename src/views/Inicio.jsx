import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import "aos/dist/aos.css";
import "../styles/Inicio.css";
import Imagen from "../assets/Frecuenciacardiaca.jpg";

const Inicio = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="inicio-wrapper">
        {/* Encabezado */}
        <header className="inicio-header" data-aos="fade-down">
            <Container>
            <h1>CardioVita</h1>
            <p>Monitorea tu hipertensión. Cuida tu salud.</p>
            <Button variant="light" onClick={() => handleNavigate("/sintomas")}>
                Registrar Síntomas
            </Button>
            </Container>
        </header>

        {/* Ventajas */}
        <section className="inicio-section bg-light" data-aos="fade-up">
            <Container>
            <h2 className="text-center">¿Por qué usar CardioVita?</h2>
            <Row className="mt-4 text-center">
            <Col md={4}>
                <Card className="tarjeta-info">
                <Card.Body>✔ Registro diario de síntomas</Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="tarjeta-info">
                <Card.Body>📈 Seguimiento del estado de ánimo</Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="tarjeta-info">
                <Card.Body>🔒 Datos seguros y privados</Card.Body>
                </Card>
            </Col>
            </Row>
            </Container>
        </section>

        {/* Propuesta de valor */}
        <section className="inicio-section dark-section" data-aos="fade-left">
            <Container>
            <Row className="align-items-center">
                <Col md={6}>
                <h3>Controla tu Frecuencia Cardiaca con tecnología</h3>
                <p>
                Monitorea tu ritmo cardíaco usando solo la cámara de tu dispositivo.
                Coloca tu dedo sobre la cámara y detecta tus BPM de forma rápida, segura y sin dispositivos externos.
                Los resultados se almacenan automáticamente para llevar un mejor control de tu salud cardiovascular.
                </p>
                <p>
                Este monitoreo no es totalmente exacto, tiene un margen de error y cosas como el movimiento y entorno puede influir en el resultado
                </p>
                <Button variant="outline-light" onClick={() => handleNavigate("/corazon")}>
                    Comenzar Ahora
                </Button>
                </Col>
                <Col md={6}>
                <img
                    src={Imagen}
                    width="500" height="500"
                    alt="App CardioVita"
                    className="border d-inline-block align-top img-fluid rounded inicio-imagen"
                />
                </Col>
            </Row>
            </Container>
        </section>

        {/* Footer */}
        <footer className="inicio-footer">
            <Container className="text-center">
            <p>&copy; {new Date().getFullYear()} CardioVita | Salud para tu corazón</p>
            </Container>
        </footer>
        </div>
    );
};

export default Inicio;
