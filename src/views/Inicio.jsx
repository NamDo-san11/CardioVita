import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import "aos/dist/aos.css";
import "../styles/Inicio.css";
import Imagen from "../assets/brayan.jpg";

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
                <Col md={4}><Card body>✔ Registro diario de síntomas</Card></Col>
                <Col md={4}><Card body>📈 Seguimiento del estado de ánimo</Card></Col>
                <Col md={4}><Card body>🔒 Datos seguros y privados</Card></Col>
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
                    Nuestra aplicación te permite registrar y analizar tus síntomas, estado de ánimo y actividad diaria para un mejor manejo de la hipertensión.
                </p>
                <Button variant="outline-light" onClick={() => handleNavigate("/corazon")}>
                    Comenzar Ahora
                </Button>
                </Col>
                <Col md={6}>
                <img
                    src={Imagen}
                    width="400" height="400"
                    alt="App CardioVita"
                    className="border d-inline-block align-top img-fluid rounded"
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
