import { Card, ProgressBar } from "react-bootstrap";

const TarjetaNormativa = ({ ultima, resumen }) => {
  if (!ultima || !resumen) return null;

  const { sistolica, diastolica, rango } = ultima;

  const obtenerColor = (estado) => {
    switch (estado) {
      case "Normal": return "success";
      case "Elevada": return "warning";
      case "Alta": return "danger";
      default: return "secondary";
    }
  };

  const total = resumen.normal + resumen.elevada + resumen.alta;
  const estadoFrecuente = Object.entries(resumen).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const porcentaje = Math.round((resumen[estadoFrecuente] / total) * 100);

  return (
    <Card className="shadow-sm p-3">
      <Card.Title className="text-uppercase text-muted">Tu última lectura</Card.Title>
      <div className="mb-2">
        <strong className={`text-${obtenerColor(rango)}`}>{rango}</strong> (Sistólica: {sistolica})
        <ProgressBar now={sistolica} label={`${sistolica} mmHg`} variant={obtenerColor(rango)} />
      </div>
      <div className="mb-3">
        <strong className={`text-${obtenerColor(rango)}`}>{rango}</strong> (Diastólica: {diastolica})
        <ProgressBar now={diastolica} label={`${diastolica} mmHg`} variant={obtenerColor(rango)} />
      </div>

      <div className="mt-2">
        <small className="text-muted">Frecuencia habitual: <strong className={`text-${obtenerColor(estadoFrecuente.charAt(0).toUpperCase() + estadoFrecuente.slice(1))}`}>{estadoFrecuente.charAt(0).toUpperCase() + estadoFrecuente.slice(1)}</strong> ({porcentaje}%)</small>
      </div>
    </Card>
  );
};

export default TarjetaNormativa;
