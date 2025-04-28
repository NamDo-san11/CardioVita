import { ButtonGroup, ToggleButton } from "react-bootstrap";
import TarjetaPresion from "./TarjetaPresion";

const ListadoPresiones = ({ registros = [], filtro, setFiltro, onEdit, onDelete }) => {
  return (
    <div>
      <h5 className="fw-bold mt-4">Mediciones</h5>

      <ButtonGroup className="mb-3">
        {((tipo) => (
          <ToggleButton
            key={tipo}
            type="radio"
            variant="outline-dark"
            value={tipo}
            checked={filtro === tipo}
            onChange={(e) => setFiltro(e.currentTarget.value)}
          >
            {tipo === "todo" ? "Todo" : tipo === "mes" ? "Este Mes" : "Esta Semana"}
          </ToggleButton>
        ))}
      </ButtonGroup>

      {registros.length === 0 ? (
        <p className="text-muted">No hay registros disponibles.</p>
      ) : (
        registros.map((presion) => (
          <TarjetaPresion
            key={presion.id}
            data={presion}
            onEdit={() => onEdit(presion)}
            onDelete={() => onDelete(presion.id)}
          />
        ))
      )}
    </div>
  );
};

export default ListadoPresiones;
