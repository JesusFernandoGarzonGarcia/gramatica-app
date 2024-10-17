import React, { useState } from 'react';
import GrammarApp from './controllers/GrammarApp';
import Info from './controllers/Info';
import DerivationTree from './controllers/DerivationTree';

const App = () => {
  const [grammar, setGrammar] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showDerivationTree, setShowDerivationTree] = useState(false);

  const handleGrammarUpdate = (newGrammar) => {
    setGrammar(newGrammar);
    setShowDerivationTree(newGrammar.length > 0);
  };

  const handleInputTypeChange = () => {
    setGrammar([]);
    setShowDerivationTree(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Componente para ingresar/cargar la gramática */}
      <GrammarApp onGrammarUpdate={handleGrammarUpdate} onInputTypeChange={handleInputTypeChange} />

      {/* Solo renderiza el árbol de derivación si la gramática no está vacía */}
      {showDerivationTree && (
        <div style={{ marginTop: '40px' }}>
          <DerivationTree grammar={grammar} />
        </div>
      )}

      {/* Botón para mostrar la información */}
      <button className='info-button' onClick={() => setShowInfo(true)}>?</button>

      {/* Modal para la información */}
      {showInfo && (
        <div className='info-modal'>
          <div className='info-content'>
            <button className='close-button' onClick={() => setShowInfo(false)}>X</button>
            <div className='info-scrollable'>
              <Info />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
 