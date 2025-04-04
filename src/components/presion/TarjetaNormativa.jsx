import { Card, ProgressBar } from "react-bootstrap";

const TarjetaNormativa = ({ rango }) => {
  const { sistolica, diastolica } = rango;

  const obtenerNivel = (valor, tipo) => {
    if (tipo === "sistolica") {
      if (valor < 120) return { texto: "Normal", color: "success" };
      if (valor <= 129) return { texto: "Elevada", color: "warning" };
      return { texto: "Alta", color: "danger" };
    } else {
      if (valor < 80) return { texto: "Normal", color: "success" };
      if (valor <= 89) return { texto: "Elevada", color: "warning" };
      return { texto: "Alta", color: "danger" };
    }
  };

  const nivelSistolica = obtenerNivel(sistolica, "sistolica");
  const nivelDiastolica = obtenerNivel(diastolica, "diastolica");

  return (
    <Card className="shadow-sm p-3">
      <Card.Title className="text-uppercase text-muted">Comparar la normativa</Card.Title>
      <div className="mb-2">
        <strong className={`text-${nivelSistolica.color}`}>{nivelSistolica.texto}</strong> (Sistólica)
        <ProgressBar now={sistolica} label={`${sistolica} mmHg`} variant={nivelSistolica.color} />
      </div>
      <div>
        <strong className={`text-${nivelDiastolica.color}`}>{nivelDiastolica.texto}</strong> (Diastólica)
        <ProgressBar now={diastolica} label={`${diastolica} mmHg`} variant={nivelDiastolica.color} />
      </div>
    </Card>
  );
};

export default TarjetaNormativa;
