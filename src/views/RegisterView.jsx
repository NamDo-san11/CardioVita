import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import Paso1 from "../components/registro/Paso1";
import Paso2 from "../components/registro/Paso2";
import { db, auth, storage } from "../database/firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const RegisterView = () => {
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "usuario",
    fotoBase64: "",
    edad: "",
    peso: "",
    estatura: "",
    enfermedades: "",
    herencia: "",
    especialidad: "",
    cedula: "",
  });

  const handleChange = (campo, valor) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async () => {
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      const cred = await createUserWithEmailAndPassword(auth, datos.correo, datos.password);
      const uid = cred.user.uid;

      let urlFoto = "";
      if (datos.fotoBase64) {
        const storageRef = ref(storage, `perfiles/${uid}`);
        await uploadString(storageRef, datos.fotoBase64, "data_url");
        urlFoto = await getDownloadURL(storageRef);
      }

      const userData = {
        uid,
        nombre: datos.nombre,
        correo: datos.correo,
        rol: datos.rol,
        foto: urlFoto,
        edad: datos.edad,
        peso: datos.peso,
        estatura: datos.estatura,
        enfermedades: datos.enfermedades,
        herencia: datos.herencia,
        especialidad: datos.rol === "doctor" ? datos.especialidad : "",
        cedula: datos.rol === "doctor" ? datos.cedula : "",
        colegiacion: datos.rol === "doctor" ? datos.colegiacion : "",
        experiencia: datos.rol === "doctor" ? datos.experiencia : "",
        centroTrabajo: datos.rol === "doctor" ? datos.centroTrabajo : "",
        timestamp: serverTimestamp(),
      };

      await setDoc(doc(db, "usuarios", uid), userData);
      setMensaje("Cuenta creada exitosamente. Redirigiendo al inicio de sesión...");

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Cuenta</h2>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {paso === 1 ? (
        <Paso1 datos={datos} onChange={handleChange} onNext={() => setPaso(2)} />
      ) : (
        <Paso2
          datos={datos}
          onChange={handleChange}
          onBack={() => setPaso(1)}
          onGuardar={handleGuardar}
          cargando={cargando} 
        />
      )}
    </div>
  );
};

export default RegisterView;