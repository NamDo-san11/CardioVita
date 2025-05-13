import React from "react";

const PacienteRow = ({ paciente }) => {
  return (
    <tr>
      <td data-label="Nombre">{paciente.nombre}</td>
      <td data-label="Correo">{paciente.correo}</td>
      <td data-label="Edad">{paciente.edad}</td>
      <td data-label="IMC">{paciente.imc}</td>
      <td data-label="Herencia">{paciente.herencia}</td>
    </tr>
  );
};

export default PacienteRow;
