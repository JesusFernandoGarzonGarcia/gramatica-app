import React, { useState } from "react";

function App() {
  const [gramatica, setGramatica] = useState({});

  // Función para procesar el archivo y convertirlo en una gramática
  const procesarGramatica = (contenido) => {
    const gramaticaTemp = {};
    const lineas = contenido.split("\n");

    lineas.forEach((linea) => {
      // Limpiamos espacios y saltos de línea
      const lineaLimpia = linea.trim();
      
      if (lineaLimpia.length === 0) return; // Ignorar líneas vacías
      
      const [ladoIzquierdo, ladoDerecho] = lineaLimpia.split("->");

      if (!ladoIzquierdo || !ladoDerecho) return; // Ignorar líneas mal formateadas
      
      const producciones = ladoDerecho.split("|").map((prod) => prod.trim());

      if (gramaticaTemp[ladoIzquierdo.trim()]) {
        gramaticaTemp[ladoIzquierdo.trim()].push(...producciones);
      } else {
        gramaticaTemp[ladoIzquierdo.trim()] = producciones;
      }
    });

    setGramatica(gramaticaTemp);
  };

  // Función que se activa al subir el archivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const contenido = event.target.result;
        procesarGramatica(contenido);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <h1>Leer Gramática desde Archivo</h1>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      
      {Object.keys(gramatica).length > 0 && (
        <div>
          <h2>Gramática Procesada:</h2>
          <ul>
            {Object.keys(gramatica).map((noTerminal) => (
              <li key={noTerminal}>
                {noTerminal} - {gramatica[noTerminal].join(" | ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Logical;
