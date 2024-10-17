import React, { useState, useEffect } from 'react';

const DerivationTree = ({ grammar }) => {
  const [inputString, setInputString] = useState('');
  const [particularPath, setParticularPath] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [generalTree, setGeneralTree] = useState(null);

  const handleInputChange = (e) => {
    setInputString(e.target.value);
  };

  const generateDerivationTrees = () => {
    const tree = buildGeneralDerivationTree(grammar, inputString);
    setGeneralTree(tree);
  };

  useEffect(() => {
    if (generalTree && isValid) {
      const path = buildParticularDerivationPath(generalTree, inputString);
      setParticularPath(path);
    } else {
      setParticularPath([]);
    }
  }, [isValid, generalTree,inputString]);

  const buildGeneralDerivationTree = (grammar, targetString) => {
    const tree = { node: grammar[0]?.left, children: [] };
    const queue = [{ node: tree, depth: 0, visited: new Set([grammar[0]?.left]) }];

    let found = false;

    while (queue.length > 0) {
      const { node, depth, visited } = queue.shift();

      // Compara el nodo actual con la cadena objetivo
      if (node.node === targetString) {
        found = true;
        break;
      }

      if (depth > 100) continue;

      for (let rule of grammar) {
        if (node.node.includes(rule.left)) {
          const cleanRight = rule.right.replace(/"/g, ''); // Eliminar las comillas
          const newNode = { node: node.node.replace(rule.left, cleanRight), children: [] };

          if (!visited.has(newNode.node) && newNode.node.length <= targetString.length) {
            node.children.push(newNode);
            queue.push({ node: newNode, depth: depth + 1, visited: new Set([...visited, newNode.node]) });

            if (newNode.node === targetString) {
              found = true;
              break;
            }
          }
        }
      }
    }

    setIsValid(found);
    return tree;
  };

  const buildParticularDerivationPath = (generalTree, targetString) => {
    let path = [];

    const findPath = (node) => {
      if (node.node === targetString) {
        path.push(node.node);
        return true;
      }
      for (let child of node.children) {
        if (findPath(child)) {
          path.push(node.node); // Agregar el nodo actual al camino si se encuentra el hijo
          return true;
        }
      }
      return false;
    };

    if (!findPath(generalTree)) {
      return []; // Si no se encuentra un camino, retornar un array vacío
    }

    path.reverse();
    return path;
  };

  return (
    <div>
      <h1>Validacion de una cadena</h1>

      <div>
        <h3>Ingresar cadena a validar:</h3>
        <div className='center'>
          <input
            type="text"
            value={inputString}
            onChange={handleInputChange}
            placeholder="Ingrese una cadena de caracteres"
          />
          <button onClick={generateDerivationTrees}>Validar Cadena</button>
        </div>
      </div>
      <div>
        <br />
        <div style={{ fontSize: '24px', color: isValid ? 'green' : 'red' }}>
          {isValid === null ? '' : isValid ? 'Esta cadena pertenece a la gramática' : 'Esta cadena no pertenece a la gramática'}
        </div>
        <br />
      </div>

      {particularPath.length > 0 && (
        <div>
          <h2>Camino de derivación particular</h2>
          <ul>
            {particularPath.map((node, index) => (
              <li key={index}>{node}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DerivationTree;
