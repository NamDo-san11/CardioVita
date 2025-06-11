import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Badge } from "react-bootstrap";
import "../App.css";
import educacionData from "../components/educacion/educacionData";

const EducacionView = () => {

  const [articulos, setArticulos] = useState(() => {
    const saved = localStorage.getItem('educacionArticulos');
    return saved ? JSON.parse(saved) : educacionData;
  });
  
  const [filtroLeido, setFiltroLeido] = useState(false);
  const [articuloActivo, setArticuloActivo] = useState(null);

 
  useEffect(() => {
    localStorage.setItem('educacionArticulos', JSON.stringify(articulos));
  }, [articulos]);

  const abrirArticulo = (articulo) => {
    setArticuloActivo(articulo);
  };

  const cerrarArticulo = () => {
    setArticuloActivo(null);
  };

  const toggleLeido = (id) => {
    const nuevosArticulos = articulos.map((articulo) =>
      articulo.id === id ? { ...articulo, leido: !articulo.leido } : articulo
    );
    setArticulos(nuevosArticulos);
  };

  const toggleFavorito = (id) => {
    const nuevosArticulos = articulos.map((articulo) =>
      articulo.id === id ? { ...articulo, favorito: !articulo.favorito } : articulo
    );
    setArticulos(nuevosArticulos);
  };

  const articulosFiltrados = filtroLeido
    ? articulos.filter((articulo) => articulo.leido)
    : articulos;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <h2 className="titulo-educacion-negro mb-0">Educación para la Salud</h2>
        
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Filtrar:</span>
          <button
            onClick={() => setFiltroLeido(!filtroLeido)}
            className={`btn btn-sm ${filtroLeido ? 'btn-success' : 'btn-outline-secondary'}`}
            style={{
              borderRadius: '20px',
              padding: '0.25rem 1rem',
              whiteSpace: 'nowrap'
            }}
          >
            {filtroLeido ? (
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-check-circle"></i> Solo leídos
              </span>
            ) : (
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-list-ul"></i> Todos
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center">
        {articulosFiltrados.map((articulo) => (
          <Card
            key={articulo.id}
            style={{ width: '20rem', margin: '10px' }}
            className="shadow-lg border-0"
          >
            {articulo.imagen && (
              <Card.Img
                variant="top"
                src={articulo.imagen}
                style={{ height: "180px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => abrirArticulo(articulo)}
              />
            )}
            <Card.Body style={{ cursor: "pointer" }} onClick={() => abrirArticulo(articulo)}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="h5">{articulo.titulo}</Card.Title>
                {articulo.favorito && <Badge bg="warning" text="dark">⭐ Favorito</Badge>}
              </div>

              <Card.Text className="text-muted">
                {articulo.descripcion.length > 100
                  ? `${articulo.descripcion.substring(0, 100)}...`
                  : articulo.descripcion}
              </Card.Text>
            </Card.Body>

            <Card.Footer className="bg-white border-0">
              <div className="d-flex justify-content-between">
                <Button
                  variant={articulo.leido ? "success" : "outline-success"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLeido(articulo.id);
                  }}
                >
                  {articulo.leido ? "Leído" : "Marcar Leído"}
                </Button>

                <Button
                  variant={articulo.favorito ? "warning" : "outline-warning"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(articulo.id);
                  }}
                >
                  {articulo.favorito ? "Quitar Favorito" : "Favorito"}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {articuloActivo && (
        <Modal show onHide={cerrarArticulo} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{articuloActivo.titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {articuloActivo.imagen && (
              <img
                src={articuloActivo.imagen}
                alt={articuloActivo.titulo}
                style={{ width: "100%", height: "auto", marginBottom: "20px", borderRadius: "10px" }}
              />
            )}
            <div style={{ fontSize: "1.1rem", lineHeight: "1.7", whiteSpace: "pre-line" }}>
              {articuloActivo.contenido}
            </div>
            {articuloActivo.referencia && (
              <p className="mt-4" style={{ fontSize: "0.9rem" }}>
                <strong>{articuloActivo.referencia}</strong>
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarArticulo}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <div className="container my-5">
        <h2 className="text-center mb-5">Videos Educativos sobre la Presión Arterial</h2>
        <div className="d-flex flex-column align-items-center gap-5">
          {[
            {
              title: "¿Es importante dejar la sal?",
              url: "https://www.youtube.com/embed/SiOw0afo5vw"
            },
            {
              title: "Complicaciones de la Hipertensión",
              url: "https://www.youtube.com/embed/OR2M0t9yjQ8"
            },
            {
              title: "Consejos para Controlar la Presión",
              url: "https://www.youtube.com/embed/xdGUnNdMx34"
            }
          ].map((video, index) => (
            <div key={index} className="w-100" style={{ maxWidth: '720px' }}>
              <h4 className="text-center mb-3">{video.title}</h4>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={video.url}
                  title={video.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducacionView;