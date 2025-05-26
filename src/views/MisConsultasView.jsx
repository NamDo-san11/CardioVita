// src/views/MisConsultasView.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { db, auth } from "../database/firebaseconfig";
import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
import ConsultaPacienteCard from "../components/teleconsultas/ConsultaPacienteCard";

const MisConsultasView = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const uidPaciente = auth.currentUser?.uid;

  useEffect(() => {
    if (!uidPaciente) return;

    const q = query(
      collection(db, "teleconsultas"),
      where("idPaciente", "==", uidPaciente)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConsultas(lista.sort((a, b) => b.fecha?.toDate() - a.fecha?.toDate()));
      setLoading(false);
    });

    return () => unsub();
  }, [uidPaciente]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Mis Teleconsultas</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : consultas.length === 0 ? (
        <Alert variant="info" className="text-center">
          Aún no has realizado ninguna consulta.
        </Alert>
      ) : (
        <Row className="justify-content-center">
          {consultas.map((consulta) => (
            <Col md={6} lg={5} key={consulta.id}>
              <ConsultaPacienteCard consulta={consulta} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MisConsultasView;
