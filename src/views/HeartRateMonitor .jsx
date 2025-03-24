import React, { useEffect, useRef, useState } from "react";

export default function HeartRateMonitor() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [bpm, setBpm] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [status, setStatus] = useState("Coloca tu dedo sobre la cámara y presiona Iniciar");

  useEffect(() => {
    if (isMeasuring) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStatus("Midiendo... mantén el dedo sobre la cámara");
        });
    } else {
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach(track => track.stop());
      setStatus("Coloca tu dedo sobre la cámara y presiona Iniciar");
      setBpm(null);
      setDataPoints([]);
    }
  }, [isMeasuring]);

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
        setDataPoints(prev => {
          const updated = [...prev.slice(-100), avgRed];
          if (updated.length > 10) {
            const variation = Math.max(...updated) - Math.min(...updated);
            if (variation < 5) {
              setStatus("No se detecta señal. Ajusta tu dedo.");
            } else {
              setStatus("Señal detectada ✅ Calculando BPM...");
            }
          }
          return updated;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isMeasuring]);

  useEffect(() => {
    if (dataPoints.length >= 100) {
      let peaks = 0;
      for (let i = 1; i < dataPoints.length - 1; i++) {
        if (dataPoints[i] > dataPoints[i - 1] && dataPoints[i] > dataPoints[i + 1]) {
          peaks++;
        }
      }
      const bpmEstimate = (peaks * 60) / 10;
      setBpm(Math.round(bpmEstimate));
    }
  }, [dataPoints]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Medidor de Frecuencia Cardíaca</h1>
      <video ref={videoRef} width="300" height="200" className="hidden" />
      <canvas ref={canvasRef} width="300" height="200" className="hidden" />

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
        <p>{status}</p>
      </div>

      <button
        onClick={() => setIsMeasuring(prev => !prev)}
        className={`px-4 py-2 rounded text-white ${isMeasuring ? "bg-red-500" : "bg-blue-500"}`}
      >
        {isMeasuring ? "Detener" : "Iniciar"}
      </button>

      <div className="mt-4">
        <p className="text-lg">BPM estimado: {bpm ?? "---"}</p>
      </div>
    </div>
  );
}