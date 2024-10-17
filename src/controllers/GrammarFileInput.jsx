import React from 'react';

const GrammarFileInput = ({ onFileChange }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileChange(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h3>Cargar gramática desde un archivo .txt:</h3>
      <br />
      <div className='cargarDocumento'>
        <input type="file" accept=".txt" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default GrammarFileInput;