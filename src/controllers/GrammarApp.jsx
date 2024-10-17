import React, { useState } from 'react';
import Alert from './Alert'; // Asegúrate de que esta ruta sea correcta

const GrammarApp = ({ onGrammarUpdate, onInputTypeChange }) => {
  const [rules, setRules] = useState([{ left: '', right: '' }]);
  const [generatedGrammar, setGeneratedGrammar] = useState('');
  const [useManualInput, setUseManualInput] = useState(true);
  const [fileGrammar, setFileGrammar] = useState('');
  const [grammarAnalysis, setGrammarAnalysis] = useState(null);
  const [alerts, setAlerts] = useState([]); // Estado para almacenar las alertas activas

  // Función para mostrar alertas
  const showAlert = (message, type = 'info') => {
    const id = new Date().getTime();
    const newAlert = { id, message, type };

    setAlerts([...alerts, newAlert]);

    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 3000);
  };

  // Función para manejar cambios en los inputs
  const handleRuleChange = (index, field, value) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  // Función para agregar una nueva regla
  const addNewRule = (index) => {
    const currentRule = rules[index];
    if (!currentRule.left.trim()) {
      showAlert('La parte izquierda de la regla no puede estar vacía', 'warning');
      return;
    }

    const rightSide = currentRule.right.trim() === '' ? 'λ' : currentRule.right.trim();
    const newRules = [...rules];
    newRules[index] = { left: currentRule.left.trim(), right: rightSide };
    setRules([...newRules, { left: '', right: '' }]);
  };

  // Función para agregar una nueva regla al presionar Enter
  const handleAddRule = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewRule(index);
    }
  };
  // Función para eliminar una regla
  const handleRemoveRule = (index) => {
    if (rules.length > 1) {
      const newRules = rules.filter((_, ruleIndex) => ruleIndex !== index);
      setRules(newRules);
      showAlert('Regla eliminada correctamente', 'success');
    } else {
      showAlert('Debe haber al menos una regla visible', 'error');
    }
  };

  // Función para analizar la gramática y corregir los terminales dentro de comillas
  const analyzeGrammar = (grammar) => {
    const nonTerminals = new Set();
    const terminals = new Set();
    const productions = [];
    let initialSymbol = grammar[0]?.left.trim() || '';

    // Primero, agregamos todos los no terminales
    grammar.forEach((rule) => {
      const leftSymbol = rule.left.trim();
      nonTerminals.add(leftSymbol);
    });

    // Luego, procesamos las reglas de producción
    grammar.forEach((rule) => {
      const leftSymbol = rule.left.trim();
      const rightSymbols = rule.right.trim();
      productions.push(`${leftSymbol} -> ${rightSymbols}`);

      // Para cada símbolo en la parte derecha de la producción
      let inQuotes = false;
      let buffer = '';

      for (let char of rightSymbols) {
        if (char === '"') {
          // Iniciamos o terminamos la lectura de un símbolo entre comillas
          inQuotes = !inQuotes;
          if (!inQuotes && buffer) {
            terminals.add(buffer); // Añadimos el símbolo completo una vez terminamos las comillas
            buffer = '';
          }
        } else if (inQuotes) {
          buffer += char; // Construimos el terminal que está dentro de las comillas
        } else {
          // Si no estamos dentro de comillas, procesamos cada símbolo individual
          if (!nonTerminals.has(char) && char !== 'λ' && char.trim() !== '') {
            terminals.add(char);
          }
        }
      }
    });

    return {
      nonTerminals: Array.from(nonTerminals),
      terminals: Array.from(terminals),
      productions,
      initialSymbol
    };
  };

  // Función para formatear la gramática del archivo .txt
  const parseFileGrammar = (input) => {
    const lines = input.split('\n');

    const parsedGrammar = [];

    lines.forEach((line) => {
      const [left, right] = line.split('->').map((item) => item.trim());

      if (right) {
        // Dividimos las producciones en el lado derecho si hay múltiples alternativas separadas por '|'
        const alternatives = right.split('|').map((alt) => alt.trim());

        alternatives.forEach((alt) => {
          parsedGrammar.push({ left, right: alt });
        });
      } else {
        parsedGrammar.push({ left, right: 'λ' });
      }
    });

    return parsedGrammar;
  };

  // Función para manejar la carga del archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsedGrammar = parseFileGrammar(content);
        setFileGrammar(parsedGrammar);
        showAlert('Gramática cargada correctamente', 'success');
      };
      reader.readAsText(file);
    } else {
      showAlert('No se ha seleccionado ningún archivo', 'warning');
    }
  };

  // Función para manejar el cambio de tipo de entrada (manual o archivo) y limpiar estados
  const handleInputTypeChange = (useManual) => {
    setUseManualInput(useManual);
    setRules([{ left: '', right: '' }]);
    setFileGrammar('');
    setGeneratedGrammar('');
    setGrammarAnalysis(null);
    onInputTypeChange(); // Llama a la función para notificar el cambio de tipo de entrada
  };

  // Función para generar la gramática y analizarla
  const handleGenerateGrammar = () => {
    // Seleccionamos las reglas basándonos en el método de entrada (manual o archivo)
    const grammar = useManualInput ? rules : fileGrammar;

    // Verificamos si la gramática tiene al menos una regla válida
    if (grammar.length === 0 || grammar.every(rule => rule.left.trim() === '')) {
      showAlert('Debe haber al menos una regla visible', 'error');
      return;
    }

    // Formateamos la gramática en texto
    const formattedGrammar = grammar
      .filter((rule) => rule.left.trim() !== '') // Filtramos reglas vacías
      .map((rule) => `${rule.left.trim()} -> ${rule.right.trim()}`)
      .join('\n');

    // Actualizamos el estado con la gramática generada
    setGeneratedGrammar(formattedGrammar);

    // Analizamos la gramática
    const analysis = analyzeGrammar(grammar);
    setGrammarAnalysis(analysis);

    // Llamamos la función para actualizar la gramática (si es necesario)
    onGrammarUpdate(grammar);

    // Mostramos el componente GrammarDisplay
  };

  return (
    <div>
      <div  className='center'>
      <h1>Generador de Gramáticas</h1>
      </div>
      <br></br>
      <br></br>
      {/* Sección de Alertas */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={() => setAlerts((prevAlerts) => prevAlerts.filter((a) => a.id !== alert.id))}
          />
        ))}
      </div>
      <div className='center manual'>
        <div>
          <label>
            <input
              type="radio"
              name="inputType"
              value="manual"
              checked={useManualInput}
              onChange={() => handleInputTypeChange(true)}
            />
            Ingresar manualmente
          </label>

          <label>
            <input
              type="radio"
              name="inputType"
              value="file"
              checked={!useManualInput}
              onChange={() => handleInputTypeChange(false)}
            />
            Cargar archivo
          </label>
        </div>
      </div>

      {useManualInput ? (
        <div className='center'>
          <div>
            <br></br>
            <br></br>
            <div className='center manual'>
            <h3>Ingrese las reglas de la gramática:</h3>
            </div>
            {rules.map((rule, index) => (
              <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={rule.left}
                  onChange={(e) => handleRuleChange(index, 'left', e.target.value)}
                  placeholder="Parte izquierda"
                  onKeyDown={(e) => handleAddRule(e, index)}
                  style={{ marginRight: '5px' }}
                />
                <label style={{ marginRight: '5px' }}>→</label>
                <input
                  type="text"
                  value={rule.right}
                  onChange={(e) => handleRuleChange(index, 'right', e.target.value)}
                  placeholder="Parte derecha"
                  onKeyDown={(e) => handleAddRule(e, index)}
                  style={{ marginRight: '5px' }}
                />
                <button onClick={() => addNewRule(index)} style={{ marginLeft: '5px' }}>Agregar</button>
                <button className='eliminar'onClick={() => handleRemoveRule(index)}>Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <div className='center'>
          <h3>Cargar gramática desde un archivo .txt:</h3>
          <br />
          <div className='cargarDocumento'>
            <input type="file" accept=".txt" onChange={handleFileChange} />
          </div>
          </div>
        </div>
      )}
      <br />
      <div className='center'>
        <button onClick={handleGenerateGrammar}>Generar Gramática</button>
      </div>

      {generatedGrammar && (
        <div>
          <h1>Gramática Generada:</h1>
          <div className='center'>
            <pre>{generatedGrammar}</pre>
          </div>
        </div>
      )}

      <div className='center'>
        {grammarAnalysis && (
          <div>
            <h1>Análisis de la Gramática:</h1>
            <p><strong>Símbolo Inicial:</strong> {grammarAnalysis.initialSymbol}</p>
            <p><strong>Simbolos No Terminales (N):</strong> {grammarAnalysis.nonTerminals.join(', ')}</p>
            <p><strong>Simbolos Terminales (T):</strong> {grammarAnalysis.terminals.join(', ')}</p>
            <p><strong>Producciones (P):</strong></p>
            <ul>
              {grammarAnalysis.productions.map((prod, index) => (
                <li key={index}>{prod}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};

export default GrammarApp;
