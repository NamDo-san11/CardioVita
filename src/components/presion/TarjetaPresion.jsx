import { Card, Button } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";

const TarjetaPresion = ({ data, onEdit, onDelete }) => {
  const { fecha, hora, sistolica, diastolica, rango } = data;

  const obtenerColor = (rango) => {
    switch (rango) {
      case "Baja": return "info"
      case "Normal": return "success";
      case "Elevada": return "warning";
      case "Alta": return "danger";
      default: return "secondary";
    }
  };

  return (
    <Card className="mb-3 shadow-sm p-3 rounded">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="text-muted" style={{ fontSize: "0.85rem" }}>{fecha}, {hora}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {sistolica}/{diastolica} <span style={{ fontSize: "1rem" }}>mmHg</span>
          </div>
        </div>
        <div className="text-end">
          <span className={`badge bg-${obtenerColor(rango)} mb-2`}>{rango}</span>
          <div>
            <Button variant="outline-secondary" size="sm" className="me-2" onClick={onEdit}>
              <PencilSquare size={16} />
            </Button>
            <Button variant="outline-danger" size="sm" onClick={onDelete}>
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TarjetaPresion;
