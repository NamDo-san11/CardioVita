import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TarjetaNormativa from "../components/presion/TarjetaNormativa";
import TarjetaInformativa from "../components/presion/TarjetaInformativa";
import ModalPresion from "../components/presion/ModalPresion";
import { db, auth } from "../database/firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/PresionArterial.css";

const PresionArterialView = () => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleGuardarPresion = async (datos) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para guardar tu presión arterial.");
      return;
    }

    const data = {
      ...datos,
      uid: user.uid,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "presion_arterial"), data);
      alert("Registro guardado exitosamente.");
    } catch (error) {
      console.error("Error al guardar la presión arterial:", error);
    }
  };

  return (
    <Container className="presion-container mt-4">
       <br />
       <br />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary">Presión Arterial</h2>
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          + Agregar
        </Button>
      </div>

      <Row>
        <Col md={12} className="mb-3">
          <TarjetaNormativa rango={{ sistolica: 100, diastolica: 65 }} />
        </Col>
        <Col md={12}>
          <TarjetaInformativa />
        </Col>
      </Row>

      <ModalPresion
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        onGuardar={handleGuardarPresion}
      />
    </Container>
  );
};

export default PresionArterialView;
