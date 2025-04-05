import { Card, ListGroup } from "react-bootstrap";

const TarjetaInformativa = () => {
  return (
    <Card className="bg-light p-3">
      <Card.Title className="text-danger">
        <i className="bi bi-heart-pulse-fill me-2"></i>Sobre la hipertensión
      </Card.Title>

      <Card.Text style={{ fontSize: "0.9rem" }}>
        La <strong>hipertensión arterial</strong> es una condición en la que la presión de la sangre contra las paredes
        de las arterias es consistentemente elevada. Puede no presentar síntomas, pero con el tiempo dañar órganos vitales.
      </Card.Text>

      <ListGroup variant="flush" className="mb-3">
        <ListGroup.Item>
          🔹 <strong>Sistólica</strong>: presión cuando el corazón se contrae
        </ListGroup.Item>
        <ListGroup.Item>
          🔹 <strong>Diastólica</strong>: presión cuando el corazón se relaja
        </ListGroup.Item>
        <ListGroup.Item>
          🧠 Una presión normal es aproximadamente <strong>120/80 mmHg</strong>
        </ListGroup.Item>
        <ListGroup.Item>
          ⚠️ Valores elevados pueden provocar enfermedades del corazón, riñones o cerebro
        </ListGroup.Item>
      </ListGroup>

      <Card.Text style={{ fontSize: "0.9rem" }}>
        👉 Es importante registrar tus lecturas regularmente y compartirlas con tu médico.
        Mantener una dieta saludable, hacer ejercicio y evitar el estrés son claves para controlarla.
      </Card.Text>
    </Card>
  );
};

export default TarjetaInformativa;
