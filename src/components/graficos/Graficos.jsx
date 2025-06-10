import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import "../../styles/Graficos.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const colorSegunEstado = {
  Normal: "#2ecc71",
  Alta: "#e74c3c",
};

const filtrarPorRango = (registros, rango) => {
  const ahora = new Date();
  const filtrarPorDias = (dias) =>
    registros.filter((r) => (ahora - r.fechaHora) / (1000 * 60 * 60 * 24) <= dias);
  switch (rango) {
    case "semana":
      return filtrarPorDias(7);
    case "mes":
      return filtrarPorDias(30);
    case "año":
      return filtrarPorDias(365);
    default:
      return registros;
  }
};

const Graficos = ({ registros, rolUsuario }) => {
  const [filtro, setFiltro] = useState("mes");
  const [anchoVentana, setAnchoVentana] = useState(window.innerWidth); // para forzar re-render
  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setAnchoVentana(window.innerWidth); // cambia el key => rerenderiza
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (rolUsuario === "doctor") {
    return (
      <p style={{ textAlign: "center", color: "#888", fontSize: "18px" }}>
        No tienes permisos para ver esta sección.
      </p>
    );
  }

  const filtrados = filtrarPorRango(registros, filtro).reverse();

  const etiquetas = filtrados.map((r) =>
    new Date(r.fechaHora).toLocaleDateString("es-ES")
  );

  const sistolicaValores = filtrados.map((r) => r.sistolica);
  const diastolicaValores = filtrados.map((r) => r.diastolica);

  const estadosGlobales = filtrados.map((r) => {
    const esNormal = r.sistolica < 120 && r.diastolica < 80;
    return esNormal ? "Normal" : "Alta";
  });

  const data = {
    labels: etiquetas,
    datasets: [
      {
        label: "Presión Sistólica",
        data: sistolicaValores,
        backgroundColor: estadosGlobales.map((estado) => colorSegunEstado[estado]),
      },
      {
        label: "Presión Diastólica",
        data: diastolicaValores,
        backgroundColor: estadosGlobales.map((estado) => colorSegunEstado[estado]),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const valor = ctx.raw;
            const estado = estadosGlobales[ctx.dataIndex];
            return `${ctx.dataset.label}: ${valor} mmHg (${estado})`;
          },
        },
      },
      legend: {
        position: "top",
        labels: { font: { weight: "bold" } },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Presión (mmHg)" },
      },
      x: {
        title: { display: true, text: "Fecha" },
      },
    },
  };

  const exportarPDF = async () => {
    const canvas = await html2canvas(chartContainerRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    pdf.text("Reporte de Presión Arterial", 15, 15);
    pdf.addImage(imgData, "PNG", 10, 30, 270, 100);
    pdf.save("reporte_presion.pdf");
  };

  const exportarExcel = () => {
    const datos = filtrados.map((r) => ({
      Fecha: new Date(r.fechaHora).toLocaleDateString("es-ES"),
      "Presión Sistólica": r.sistolica,
      "Presión Diastólica": r.diastolica,
      Estado: r.sistolica < 120 && r.diastolica < 80 ? "Normal" : "Alta",
    }));
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Presión Arterial");
    XLSX.writeFile(libro, "reporte_presion.xlsx");
  };

  return (
    <div className="grafico-card">
      <div className="filtros-grafico">
        <button onClick={() => setFiltro("semana")} className={filtro === "semana" ? "activo" : ""}>Semana</button>
        <button onClick={() => setFiltro("mes")} className={filtro === "mes" ? "activo" : ""}>Mes</button>
        <button onClick={() => setFiltro("año")} className={filtro === "año" ? "activo" : ""}>Año</button>
      </div>

      {filtrados.length > 0 ? (
        <>
          <div
            ref={chartContainerRef}
            style={{ width: "100%", height: "400px", position: "relative" }}
          >
            <Bar key={filtro + anchoVentana} data={data} options={options} />
          </div>

          <div className="export-buttons" style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={exportarPDF}>Exportar PDF</button>
            <button onClick={exportarExcel}>Exportar Excel</button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "#888", fontSize: "18px", marginTop: "40px" }}>
          No hay registros disponibles para el período seleccionado.
        </p>
      )}
    </div>
  );
};

export default Graficos;
