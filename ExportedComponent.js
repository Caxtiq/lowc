import React from 'react';

const ExportedComponent = () => {
  return (
    <div>
      <button onClick={() => console.log("Button clicked")}>Click me</button>
      <input type="text" placeholder="Enter text" />
    </div>
  );
};

export default ExportedComponent;