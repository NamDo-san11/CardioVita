import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../database/authcontext";
import { db } from "../database/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PerfilUsuarioCard from "../components/perfil/PerfilUsuarioCard";
import PerfilForm from "../components/perfil/PerfilForm";

const VerPerfilView = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const obtenerPerfil = async () => {
      if (user) {
        const ref = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) setPerfil(docSnap.data());
      }
    };
    obtenerPerfil();
  }, [user]);

  const handleEditar = () => setModoEdicion(true);
  const handleCancelar = () => setModoEdicion(false);

  const handleChange = (campo, valor) => {
    setPerfil((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async () => {
    try {
      const ref = doc(db, "usuarios", user.uid);
      await updateDoc(ref, perfil);
      setModoEdicion(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  return (
    <Container className="my-5">
      <h3 className="mb-4">Mi Perfil</h3>
      {perfil &&
        (modoEdicion ? (
          <PerfilForm
            datos={perfil}
            onChange={handleChange}
            onGuardar={handleGuardar}
            onCancelar={handleCancelar}
          />
        ) : (
          <PerfilUsuarioCard datos={perfil} onEditar={handleEditar} />
        ))}
    </Container>
  );
};

export default VerPerfilView;