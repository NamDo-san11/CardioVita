import { Card, ProgressBar } from "react-bootstrap";

const TarjetaNormativa = ({ registros, resumen }) => {
  if (!registros || registros.length === 0 || !resumen) return null;

  const promedio = registros.reduce(
    (acc, curr) => {
      acc.sistolica += curr.sistolica || 0;
      acc.diastolica += curr.diastolica || 0;
      return acc;
    },
    { sistolica: 0, diastolica: 0 }
  );

  const total = registros.length;
  const sistolicaPromedio = Math.round(promedio.sistolica / total);
  const diastolicaPromedio = Math.round(promedio.diastolica / total);

  const obtenerColor = (valor) => {
    if (valor < 120) return "success";
    if (valor <= 129) return "warning";
    return "danger";
  };

  const totalEstados = resumen.normal + resumen.elevada + resumen.alta;
  const estadoFrecuente = Object.entries(resumen).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const porcentaje = Math.round((resumen[estadoFrecuente] / totalEstados) * 100);

  return (
    <Card className="shadow-sm p-3">
      <Card.Title className="text-uppercase text-muted">Tu promedio de presión arterial</Card.Title>
      <div className="mb-2">
        <strong className={`text-${obtenerColor(sistolicaPromedio)}`}>Sistólica promedio: {sistolicaPromedio} mmHg</strong>
        <ProgressBar animated now={sistolicaPromedio} label={`${sistolicaPromedio} mmHg`} variant={obtenerColor(sistolicaPromedio)} />
      </div>
      <div className="mb-3">
        <strong className={`text-${obtenerColor(diastolicaPromedio)}`}>Diastólica promedio: {diastolicaPromedio} mmHg</strong>
        <ProgressBar animated now={diastolicaPromedio} label={`${diastolicaPromedio} mmHg`} variant={obtenerColor(diastolicaPromedio)} />
      </div>
      <div className="mt-2">
        <small className="text-muted">
          Frecuencia habitual: <strong className={`text-${obtenerColor(estadoFrecuente.charAt(0).toUpperCase() + estadoFrecuente.slice(1))}`}>{estadoFrecuente.charAt(0).toUpperCase() + estadoFrecuente.slice(1)}</strong> ({porcentaje}%)
        </small>
      </div>
    </Card>
  );
};

export default TarjetaNormativa;
