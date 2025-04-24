import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { db } from "../database/firebaseconfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import  ReactGA  from "react-ga4";
import "../styles/CardioVitaMedicion.css";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

export default function HeartRateCardioVita() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [bpm, setBpm] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [status, setStatus] = useState("Coloca tu dedo sobre la cámara y presiona Iniciar");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [useTorch, setUseTorch] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  //  ? Persitencia de datos notificacion
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const SAMPLE_DURATION = 150;
  const PEAK_THRESHOLD = 1;

  useEffect(() => {
    // ?Iniciar Analityc la app
    ReactGA.initialize("G-ZPQ0YG91K6");
  
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
      title: 'HearRateMonitor.jsx'
    })
  }, []);

  useEffect(() => {
    let stream;
    async function initCamera() {
      try {
        const constraints = {
          video: {
            facingMode: { exact: "environment" },
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (useTorch && capabilities.torch) {
          await track.applyConstraints({ advanced: [{ torch: true }] });
        }
      } catch (err) {
        console.warn("Cámara trasera no disponible, usando cámara por defecto");
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (finalErr) {
          setError("No se pudo acceder a la cámara. Verifica permisos y HTTPS.");
          setIsMeasuring(false);
          return;
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStatus("Midiendo... mantén el dedo sobre la cámara");
      }
    }

    if (isMeasuring) {
      initCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isMeasuring, useTorch]);

  useEffect(() => {
    let interval;
    if (isMeasuring) {
      interval = setInterval(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const reds = [];
        for (let i = 0; i < frame.data.length; i += 4) {
          reds.push(frame.data[i]);
        }

        const avgRed = reds.reduce((a, b) => a + b, 0) / reds.length;
        setDataPoints((prev) => [...prev.slice(-SAMPLE_DURATION + 1), avgRed]);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isMeasuring]);

  useEffect(() => {
    if (dataPoints.length >= SAMPLE_DURATION) {
      let peaks = 0;
      for (let i = 1; i < dataPoints.length - 1; i++) {
        if (dataPoints[i] > dataPoints[i - 1] && dataPoints[i] > dataPoints[i + 1]) {
          peaks++;
        }
      }
      const bpmEstimate = (peaks * 60) / 15; // 15s
      setBpm(Math.round(bpmEstimate));
      setStatus("Medición completa ✅");
      setIsMeasuring(false);
    }
  }, [dataPoints]);

  useEffect(() => {
    async function guardarEnFirestore() {
      const user = getAuth().currentUser;
      if (!user || bpm === null) return;

      try {
        await addDoc(collection(db, "mediciones"), {
          uid: user.uid,
          fechaHora: Timestamp.now(),
          bpm: bpm,
        });
        setSaved(true);
      } catch (err) {
        console.error("Error al guardar en Firestore:", err);
      }
    }

    if (bpm !== null) {
      guardarEnFirestore();
    }
  }, [bpm]);

  const chartData = {
    labels: dataPoints.map((_, i) => i),
    datasets: [
      {
        label: "Señal captada",
        data: dataPoints,
        fill: false,
        borderColor: "#E1CBD7",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="heart-card">
        <br />
      <h1 className="heart-title">Frecuencia Cardíaca</h1>

      <video ref={videoRef} width="300" height="200" className="hidden" />
      <canvas ref={canvasRef} width="300" height="200" className="hidden" />

      {error && <p className="text-red-400">{error}</p>}
      <p className="heart-status">{status}</p>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => {
            setBpm(null);
            setSaved(false);
            setDataPoints([]);
            setError(null);
            setIsMeasuring(true);
            setStatus("Coloca tu dedo sobre la cámara");
          }}
          disabled={isMeasuring}
          className="heart-button"
        >
          {isMeasuring ? "Midiendo..." : "Iniciar Medición"}
        </button>

        <div className="torch-switch">
          <span className="switch-label">Flash</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={useTorch}
              onChange={() => setUseTorch(!useTorch)}
              disabled={isMeasuring}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {bpm !== null && (
        <div className="heart-bpm">
          <p>BPM estimado:</p>
          <div>{bpm}</div>
          {saved && <p style={{ color: "lightgreen", fontSize: "0.9rem" }}>Guardado en Firestore ✅</p>}
        </div>
      )}

      {dataPoints.length > 10 && (
        <div className="heart-chart">
          <h2 style={{ textAlign: "center" }}>Señal captada</h2>
          <Line data={chartData} options={{ responsive: true, scales: { x: { display: false }, y: { beginAtZero: false } } }} />
        </div>
      )}
    </div>
  );
}