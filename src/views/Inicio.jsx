import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import { useAuth } from "../database/authcontext";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import "aos/dist/aos.css";
import "../styles/Inicio.css";
import Imagen from "../assets/Frecuenciacardiaca.jpg";
import ModalInstalacionIOS from "../components/Ini/ModalInstalacionIOS";
import ChatBotIntegrado from "../components/ChatBotIntegrado";
import Idefault from "../assets/default.jpeg"


const Inicio = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [solicitudInstalacion, setSolicitudInstalacion] = useState(null);
    const [mostrarBotonInstalacion, setMostrarBotonInstalacion] = useState(false);
    const [esDispositivoIOS, setEsDispositivoIOS] = useState(false);
    const [mostrarModalInstrucciones, setMostrarModalInstrucciones] = useState(false);

    const abrirModalInstrucciones = () => setMostrarModalInstrucciones(true);
    const cerrarModalInstrucciones = () => setMostrarModalInstrucciones(false);

    // Detectar si el dispositivo es iOS
    useEffect(() => {
        const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setEsDispositivoIOS(esIOS);
    }, []);

    // Capturar el evento beforeinstallprompt
    useEffect(() => {
        const manejarSolicitudInstalacion = (evento) => {
        evento.preventDefault();
        setSolicitudInstalacion(evento);
        setMostrarBotonInstalacion(true);
        };

        window.addEventListener("beforeinstallprompt", manejarSolicitudInstalacion);

        return () => {
        window.removeEventListener("beforeinstallprompt", manejarSolicitudInstalacion);
        };
    }, []);

    // Función para lanzar el prompt de instalación
    const instalacion = async () => {
        if (!solicitudInstalacion) return;

        try {
        await solicitudInstalacion.prompt();
        const { outcome } = await solicitudInstalacion.userChoice;
        console.log(outcome === "accepted" ? "Instalación aceptada" : "Instalación rechazada");
        } catch (error) {
        console.error("Error al intentar instalar la PWA:", error);
        } finally {
        setSolicitudInstalacion(null);
        setMostrarBotonInstalacion(false);
        }
    };
    
    useEffect(() => {
        const obtenerPerfil = async () => {
            if (user) {
                const ref = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setPerfil(docSnap.data());
                }
            }
        };
        obtenerPerfil();
    }, [user]);

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
            </Container>
                {/* Botón para Android/otros */}
        {!esDispositivoIOS && mostrarBotonInstalacion && (
            <div className="my-4">
            
            <Button className="sombra" variant="primary" onClick={instalacion}>
                Instalar app <i className="bi bi-download"></i>
            </Button>
            </div>
        )}

        {/* Botón para iOS */}
        {esDispositivoIOS && (
            <div className="text-center my-4">
            <Button className="sombra" variant="primary" onClick={abrirModalInstrucciones}>
                Cómo instalar en iPhone <i className="bi bi-phone"></i>
            </Button>
            </div>
        )}

        {/* Modal de instrucciones para iOS */}
        <ModalInstalacionIOS
            mostrar={mostrarModalInstrucciones}
            cerrar={cerrarModalInstrucciones}
        />
            
        </header>

        {/* Perfil del usuario */}
        {perfil && (
            <Container className="my-5">
                <Card className="shadow rounded text-center p-4">
                    <Row className="align-items-center">
                        <Col md={2}>
                            <img
                                src={perfil.foto || Idefault}
                                alt="Foto perfil"
                                className="rounded-circle"
                                width="80"
                                height="80"
                            />
                        </Col>
                        <Col md={10} className="text-start">
                            <h5>{perfil.nombre}</h5>
                            <p className="mb-1 text-muted">Correo: {perfil.correo || "N/A"}</p>
                            <p className="mb-1">Pesa    {perfil.peso || "??"} kg</p>
                            <p className="mb-1">
                                Emfermdades: {perfil.enfermedades || "sin Emfermdades"}
                            </p>
                            <div className="mt-3">
                                <Button variant="outline-secondary" className="me-2" onClick={() => navigate("/verperfil")}>
                                    Más información
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Container>
        )}

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
            <ChatBotIntegrado />
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
