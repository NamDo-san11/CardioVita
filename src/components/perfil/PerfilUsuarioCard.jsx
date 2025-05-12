import React from "react";
import { Button } from "react-bootstrap";
import "../../styles/PerfilUsuarioCard.css";

const PerfilUsuarioCard = ({ datos, onEditar }) => {
  const {
    nombre,
    correo,
    rol,
    edad,
    peso,
    estatura,
    enfermedades,
    herencia,
    foto,
    especialidad,
    cedula,
    colegiacion,
    experiencia,
    centroTrabajo,
  } = datos;

  return (
    <div className="perfil-card">
      <img
        src={foto || "https://via.placeholder.com/150"}
        alt="Perfil"
        className="perfil-foto"
      />

      <div className="perfil-info">
        <h5>{nombre}</h5>
        <p><span className="perfil-label">Correo:</span> {correo}</p>
        <p><span className="perfil-label">Rol:</span> {rol}</p>

        {rol === "usuario" && (
          <>
            <p><span className="perfil-label">Edad:</span> {edad} años</p>
            <p><span className="perfil-label">Peso:</span> {peso} kg</p>
            <p><span className="perfil-label">Estatura:</span> {estatura} m</p>
            <p><span className="perfil-label">Enfermedades:</span> {enfermedades || "No registradas"}</p>
            <p><span className="perfil-label">Historial Familiar:</span> {herencia === "si" ? "Sí" : "No"}</p>
          </>
        )}

        {rol === "doctor" && (
          <>
            <p><span className="perfil-label">Especialidad:</span> {especialidad}</p>
            <p><span className="perfil-label">Cédula:</span> {cedula}</p>
            <p><span className="perfil-label">N° Colegiación:</span> {colegiacion}</p>
            <p><span className="perfil-label">Años de experiencia:</span> {experiencia}</p>
            <p><span className="perfil-label">Centro de trabajo:</span> {centroTrabajo}</p>
          </>
        )}

        <div className="perfil-botones">
          <Button variant="outline-primary" onClick={onEditar}>
            Editar Perfil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuarioCard;
