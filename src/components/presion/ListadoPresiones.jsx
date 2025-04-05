import { useState } from "react";
import TarjetaPresion from "./TarjetaPresion";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const ListadoPresiones = ({ registros = [], onEdit, onDelete }) => {
  const [filtro, setFiltro] = useState("todo");

  const filtrarPorFecha = (lista) => {
    const ahora = new Date();
    return lista.filter(({ fecha }) => {
      const f = new Date(fecha);
      if (filtro === "semana") {
        const dias = (ahora - f) / (1000 * 60 * 60 * 24);
        return dias <= 7;
      }
      if (filtro === "mes") {
        return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
      }
      return true;
    });
  };

  const presionesFiltradas = filtrarPorFecha(registros);

  return (
    <div>
      <h5 className="fw-bold mt-4">Mediciones</h5>
      <ButtonGroup className="mb-3">
        <ToggleButton
          key="todo"
          type="radio"
          variant="outline-dark"
          value="todo"
          checked={filtro === "todo"}
          onChange={(e) => setFiltro(e.currentTarget.value)}
        >
          Todo
        </ToggleButton>
        <ToggleButton
          key="mes"
          type="radio"
          variant="outline-dark"
          value="mes"
          checked={filtro === "mes"}
          onChange={(e) => setFiltro(e.currentTarget.value)}
        >
          Este Mes
        </ToggleButton>
        <ToggleButton
          key="semana"
          type="radio"
          variant="outline-dark"
          value="semana"
          checked={filtro === "semana"}
          onChange={(e) => setFiltro(e.currentTarget.value)}
        >
          Esta Semana
        </ToggleButton>
      </ButtonGroup>

      {presionesFiltradas.length === 0 ? (
        <p className="text-muted">No hay registros disponibles.</p>
      ) : (
        presionesFiltradas.map((presion) => (
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
