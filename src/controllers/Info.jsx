import React from 'react';

const Info = () => {
  return (
    <div className='info-container'>
      <h2>Información de Uso de la Aplicación</h2>
      <p>Esta aplicación permite la creación y análisis de gramáticas de forma manual o cargando un archivo. A continuación se explica cómo utilizar cada uno de los métodos de entrada y algunas limitaciones:</p>
      
      <h3>Formato de Entrada Manual</h3>
      <ul>
        <li>
          <strong>Parte Izquierda:</strong> Debe ingresar un símbolo no terminal. Solo se permite un símbolo por regla, y este debe ser una letra mayúscula.
        </li>
        <li>
          <strong>Parte Derecha:</strong> Puede ingresar una cadena de terminales y no terminales para la producción. Si desea ingresar una producción vacía, utilice el símbolo <code>&lambda;</code>.
        </li>
        <li>
          <strong>Limitación:</strong> No es posible usar el símbolo <code>|</code> para definir múltiples producciones en una sola línea. Cada producción debe ser ingresada de forma individual, presionando la tecla <code>Enter</code> para agregar una nueva regla.
        </li>
      </ul>

      <h3>Formato del Archivo a Cargar</h3>
      <ul>
        <li>
          El archivo debe estar en formato <code>.txt</code> y debe seguir el siguiente esquema:
          <pre>
S {`->`} aA | bB <br />
A {`->`} a | &lambda; <br />
B {`->`} b <br />
          </pre>
          En el ejemplo anterior, <code>S</code> es el símbolo inicial, y cada línea representa una regla de producción.
        </li>
        <li>
          Las producciones múltiples para un no terminal se pueden definir separándolas con el símbolo <code>|</code>.
        </li>
        <li>
          Si una producción es vacía, utilice el símbolo <code>&lambda;</code> para representarla.
        </li>
      </ul>

      <h3>Consideraciones Adicionales</h3>
      <ul>
        <li>El símbolo inicial será el primer símbolo no terminal definido en las reglas ingresadas.</li>
        <li>Los terminales se detectan automáticamente y son aquellos símbolos que no están definidos como no terminales.</li>
        <li>Si elimina una regla, debe haber al menos una regla visible en la entrada manual.</li>
        <li>Las alertas informativas se muestran para guiarle durante el proceso de ingreso de reglas y para notificar errores o advertencias.</li>
      </ul>
    </div>
  );
};

export default Info;
