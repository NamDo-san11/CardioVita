import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import logo from "../assets/logo.png";
import { useAuth } from "../database/authcontext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import { useTranslation } from "react-i18next";

import "../styles/Encabezado.css"; // Asegúrate de tener este archivo CSS en tu proyecto

const Encabezado = () => {
  const [rolUsuario, setRolUsuario] = useState(null);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obtenerRol = async () => {
      if (user) {
        const ref = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setRolUsuario(docSnap.data().rol?.toLowerCase());
        }
      }
    };
    obtenerRol();
  }, [user]);

  const handleLogout = async () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
    await logout();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShow(false);
  };

  const cambiarIdioma = (lng) => i18n.changeLanguage(lng);

  const ocultar = ["/", "/registro"].includes(location.pathname);
  if (ocultar) return null;

  const menuKeys = [
    "inicio",
    "educacion",
    "sintomas",
    "consultas",
    "doctores",
    "presion",
    "estadisticas",
    "chat",
    "alertas",
    "notificacion",
    "estado",
    "pacientes",
    "riesgo",
    "cerrarSesion",
    "idioma"
  ];

  return (
    <Navbar expand="lg" className="bg-primary navbar-dark px-3 py-4" fixed="top">
      <Container fluid>
        <Navbar.Brand onClick={() => handleNavigate("/inicio")} className="d-flex align-items-center nav-hover fs-5" style={{ cursor: "pointer" }}>
          <img src={logo} alt="logo" width="30" height="30" className="me-2" />
          <strong>Cardiovita</strong>
        </Navbar.Brand>

        <Nav className="d-none d-lg-flex align-items-center gap-4 text-white fs-6">
          {[{ path: "/inicio", icon: "house-door-fill", key: "inicio" },
            { path: "/educacion", icon: "journal-text", key: "educacion" },
            rolUsuario === "usuario" && { path: "/sintomas", icon: "thermometer-half", key: "sintomas" },
            rolUsuario === "usuario" && { path: "/consultas", icon: "calendar-event-fill", key: "consultas" },
            rolUsuario === "usuario" && { path: "/listdoc", icon: "file-person-fill", key: "doctores" },
            rolUsuario === "doctor" && { path: "/chadoct", icon: "chat-left-text", key: "chat" },
            rolUsuario === "doctor" && { path: "/docestado", icon: "file-earmark-person-fill", key: "estado" },
            rolUsuario === "doctor" && { path: "/pacientes", icon: "people-fill", key: "pacientes" },
            rolUsuario === "doctor" && { path: "/alertasderiesgo", icon: "exclamation-triangle-fill", key: "riesgo" }
          ].filter(Boolean).map(({ path, icon, key }) => (
            <Nav.Link onClick={() => handleNavigate(path)} className="nav-hover" key={key}>
              <i className={`bi bi-${icon} me-1`}></i>{t(`menu.${key}`)}
            </Nav.Link>
          ))}

          {rolUsuario === "usuario" && (
            <NavDropdown title={<span className="nav-hover"><i className="bi bi-heart-pulse-fill me-1"></i>{t("menu.salud")}</span>} menuVariant="dark" className="fs-6">
              <NavDropdown.Item onClick={() => handleNavigate("/presion")}> <i className="bi bi-heart-pulse me-1"></i>{t("menu.presion")}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavigate("/graficos")}> <i className="bi bi-bar-chart me-1"></i>{t("menu.estadisticas")}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavigate("/chat")}> <i className="bi bi-chat-left-text me-1"></i>{t("menu.chat")}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavigate("/alertasmedicacion")}> <i className="bi bi-exclamation-triangle-fill me-1"></i>{t("menu.alertas")}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavigate("/notificacionpaciente")}> <i className="bi bi-capsule me-1"></i>{t("menu.notificacion")}</NavDropdown.Item>
            </NavDropdown>
          )}

          <NavDropdown title={<span className="nav-hover"><i className="bi bi-translate me-1"></i>{t("menu.idioma")}</span>} menuVariant="dark" className="fs-6">
            <NavDropdown.Item onClick={() => cambiarIdioma("es")}>{t("menu.español")}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => cambiarIdioma("en")}>{t("menu.ingles")}</NavDropdown.Item>
            <NavDropdown.Item onClick={() => cambiarIdioma("ja")}>{t("menu.japones")}</NavDropdown.Item>
          </NavDropdown>

          {isLoggedIn && (
            <Nav.Link onClick={handleLogout} className="nav-hover"> <i className="bi bi-box-arrow-right me-1"></i>{t("menu.cerrarSesion")}</Nav.Link>
          )}
        </Nav>

        <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setShow(true)} className="d-lg-none" />

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          show={show}
          onHide={() => setShow(false)}
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              <i className="bi bi-heart-pulse me-2"></i>Cardiovita
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column text-start fs-5">
              {[{ path: "/inicio", icon: "house-door-fill", key: "inicio" },
                { path: "/educacion", icon: "journal-text", key: "educacion" },
                rolUsuario === "usuario" && { path: "/sintomas", icon: "thermometer-half", key: "sintomas" },
                rolUsuario === "usuario" && { path: "/consultas", icon: "calendar-event-fill", key: "consultas" },
                rolUsuario === "usuario" && { path: "/listdoc", icon: "file-person-fill", key: "doctores" },
                rolUsuario === "doctor" && { path: "/chadoct", icon: "chat-left-text", key: "chat" },
                rolUsuario === "doctor" && { path: "/docestado", icon: "file-earmark-person-fill", key: "estado" },
                rolUsuario === "doctor" && { path: "/pacientes", icon: "people-fill", key: "pacientes" },
                rolUsuario === "doctor" && { path: "/alertasderiesgo", icon: "exclamation-triangle-fill", key: "riesgo" }
              ].filter(Boolean).map(({ path, icon, key }) => (
                <Nav.Link onClick={() => handleNavigate(path)} className="nav-hover" key={key}>
                  <i className={`bi bi-${icon} me-2`}></i>{t(`menu.${key}`)}
                </Nav.Link>
              ))}
              {rolUsuario === "usuario" && (
                <NavDropdown title={<span><i className="bi bi-heart-pulse-fill me-2"></i>{t("menu.presion")}</span>} menuVariant="dark">
                  <NavDropdown.Item onClick={() => handleNavigate("/presion")}> <i className="bi bi-heart-pulse me-2"></i>{t("menu.presion")}</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavigate("/graficos")}> <i className="bi bi-bar-chart me-2"></i>{t("menu.estadisticas")}</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavigate("/chat")}> <i className="bi bi-chat-left-text me-2"></i>{t("menu.chat")}</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavigate("/alertasmedicacion")}> <i className="bi bi-exclamation-triangle-fill me-2"></i>{t("menu.alertas")}</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavigate("/notificacionpaciente")}> <i className="bi bi-capsule me-2"></i>{t("menu.notificacion")}</NavDropdown.Item>
                </NavDropdown>
              )}
              <NavDropdown title={<span><i className="bi bi-translate me-2"></i>{t("menu.idioma")}</span>} menuVariant="dark">
                <NavDropdown.Item onClick={() => cambiarIdioma("es")}>{t("menu.español")}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => cambiarIdioma("en")}>{t("menu.ingles")}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => cambiarIdioma("ja")}>{t("menu.japones")}</NavDropdown.Item>
              </NavDropdown>
              {isLoggedIn && (
                <Nav.Link onClick={handleLogout}> <i className="bi bi-box-arrow-right me-2"></i>{t("menu.cerrarSesion")}</Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
