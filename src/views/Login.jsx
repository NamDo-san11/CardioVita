import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoginForm from "../components/LoginForm";
import { appfirebase } from "../database/firebaseconfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../database/authcontext";
import  ReactGA  from "react-ga4";

import "../App.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // ?Iniciar Analityc la app
        ReactGA.initialize("G-ZPQ0YG91K6");
      
        ReactGA.send({
          hitType: 'pageview',
          page: window.location.pathname,
          title: 'Login.jsx'
        })
      }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const auth = getAuth(appfirebase);

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Usuario autenticado:", userCredential.user);
            // Guardar las credenciales en localStorage
            localStorage.setItem("adminEmail", email);
            localStorage.setItem("adminPassword", password);
            // Redirigir después de iniciar sesión
            navigate("/inicio");
        })
        .catch((error) => {
            setError("Error de autenticación. Verifica tus credenciales.");
            console.error(error);
        });
    };

    // ! Si el usuario ya está autenticado, redirigir automáticamente
    if (user) {
        navigate("/inicio");
    }

    return (
        <Container className="d-flex vh-100 justify-content-center align-items-center">
        <LoginForm
            email={email}
            password={password}
            error={error}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
        />
        </Container>
    );
};

export default Login;
