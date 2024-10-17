import React from 'react';

const GrammarRule = ({ rule, index, onChange, onRemove }) => {
  return (
    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={rule.left}
        onChange={(e) => onChange(index, 'left', e.target.value)}
        placeholder="Parte izquierda"
        style={{ marginRight: '5px' }}
      />
      <label style={{ marginRight: '5px' }}>→</label>
      <input
        type="text"
        value={rule.right}
        onChange={(e) => onChange(index, 'right', e.target.value)}
        placeholder="Parte derecha"
        style={{ marginRight: '10px' }}
      />
      <button onClick={onRemove}>Eliminar</button>
    </div>
  );
};

export default GrammarRule;