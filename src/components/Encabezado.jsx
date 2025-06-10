import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, NavDropdown } from "react-bootstrap";
import logo from "../assets/logo.png";
import { useAuth } from "../database/authcontext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../App.css";
import { useTranslation } from "react-i18next";

const Encabezado = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rolUsuario, setRolUsuario] = useState(null);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

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
    setIsCollapsed(false);
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
    await logout();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsCollapsed(false);
  };

  const cambiarIdioma = (lng) => i18n.changeLanguage(lng);

  const ocultar = location.pathname === "/" || location.pathname === "/registro";
  if (ocultar) return null;

  return (
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        <Navbar.Brand
          onClick={() => handleNavigate("/inicio")}
          className="text-white"
          style={{ cursor: "pointer" }}
        >
          <img
            alt=""
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top"
          />{" "}
          <strong>Cardiovita</strong>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          placement="end"
          show={isCollapsed}
          onHide={() => setIsCollapsed(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className={isCollapsed ? "color-texto-marca" : "text-white"}>
              {t("menu.menu")}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => handleNavigate("/inicio")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                {isCollapsed && <i className="bi-house-door-fill me-2"></i>}
                <strong>{t("menu.inicio")}</strong>
              </Nav.Link>

              <Nav.Link onClick={() => handleNavigate("/educacion")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                {isCollapsed && <i className="bi bi-journal-text me-2"></i>}
                <strong>{t("menu.educacion")}</strong>
              </Nav.Link>

              {rolUsuario === "usuario" && (
                <>
                  <Nav.Link onClick={() => handleNavigate("/sintomas")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-thermometer-half me-2"></i>}
                    <strong>{t("menu.sintomas")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/consultas")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-calendar-fill me-2"></i>}
                    <strong>{t("menu.consultas")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/listdoc")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-file-person-fill me-2"></i>}
                    <strong>{t("menu.doctores")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/presion")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-heart-pulse-fill me-2"></i>}
                    <strong>{t("menu.presion")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/graficos")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-bar-chart me-2"></i>}
                    <strong>{t("menu.estadisticas")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/chat")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-chat-left-text me-2"></i>}
                    <strong>{t("menu.chat")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/alertasmedicacion")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                    <strong>{t("menu.alertas")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/notificacionpaciente")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-capsule me-2"></i>}
                    <strong>{t("menu.notificacion")}</strong>
                  </Nav.Link>
                </>
              )}

              {rolUsuario === "doctor" && (
                <>
                  <Nav.Link onClick={() => handleNavigate("/chadoct")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-chat-left-text me-2"></i>}
                    <strong>{t("menu.chat")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/docestado")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-file-earmark-person-fill me-2"></i>}
                    <strong>{t("menu.estado")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/pacientes")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-people me-2"></i>}
                    <strong>{t("menu.pacientes")}</strong>
                  </Nav.Link>

                  <Nav.Link onClick={() => handleNavigate("/alertasderiesgo")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                    <strong>{t("menu.riesgo")}</strong>
                  </Nav.Link>
                </>
              )}

              {isLoggedIn && (
                <Nav.Link onClick={handleLogout} className={isCollapsed ? "text-black" : "text-white"}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  {t("menu.cerrarSesion")}
                </Nav.Link>
              )}

              <NavDropdown title={t("menu.idioma")} id="nav-dropdown" className="ms-3">
                <NavDropdown.Item onClick={() => cambiarIdioma("es")}>
                  {t("menu.español")}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => cambiarIdioma("ja")}>
                  {t("menu.japones")}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => cambiarIdioma("en")}>
                  {t("menu.ingles")}
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
