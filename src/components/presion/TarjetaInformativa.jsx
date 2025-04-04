import { Card } from "react-bootstrap";

const TarjetaInformativa = () => {
  return (
    <Card className="bg-light p-3">
      <Card.Title className="text-danger">
        <i className="bi bi-droplet-half me-2"></i>Sobre la presión arterial
      </Card.Title>
      <Card.Text style={{ fontSize: "0.9rem" }}>
        La presión arterial es la fuerza ejercida por la sangre contra las paredes de las arterias
        mientras el corazón bombea. Se mide con dos valores: <strong>Sistólica</strong> (presión cuando el corazón se contrae)
        y <strong>Diastólica</strong> (presión cuando el corazón se relaja).
      </Card.Text>
      <Card.Text style={{ fontSize: "0.9rem" }}>
        Un valor típico saludable es <strong>120/80 mmHg</strong>. Mantener estos niveles ayuda a prevenir enfermedades
        cardiovasculares. Valores fuera del rango pueden requerir seguimiento médico.
      </Card.Text>
    </Card>
  );
};

export default TarjetaInformativa;
