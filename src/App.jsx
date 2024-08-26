import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Desktop from './components/Desktop';
import './App.css';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Desktop />
      </div>
    </DndProvider>
  );
};

export default App;

