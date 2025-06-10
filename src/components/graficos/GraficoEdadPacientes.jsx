import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoEdadPacientes = ({ pacientes }) => {
  if (!pacientes || pacientes.length === 0) return null;

  const grupos = {
    "<18": 0,
    "18–35": 0,
    "36–60": 0,
    ">60": 0,
  };

  pacientes.forEach((p) => {
    const edad = Number(p.edad);
    if (isNaN(edad)) return;
    if (edad < 18) grupos["<18"]++;
    else if (edad <= 35) grupos["18–35"]++;
    else if (edad <= 60) grupos["36–60"]++;
    else grupos[">60"]++;
  });

  const data = {
    labels: Object.keys(grupos),
    datasets: [
      {
        label: "Distribución por edad",
        data: Object.values(grupos),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} paciente(s)`,
        },
      },
    },
  };

  return (
     <div style={{ width: "100%", maxWidth: "400px", height: "280px", margin: "0 auto", marginBottom: "3rem" }}>
 
      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Distribución por Edad</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default GraficoEdadPacientes;
