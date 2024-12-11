import React from 'react';
import { ComponentItem } from './YouOwnProject';
import { Button } from "@/components/ui/button"

interface ExportButtonProps {
  items: ComponentItem[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ items }) => {
  const generateCode = () => {
    let code = `import React from 'react';\n\n`;
    code += `const ExportedComponent = () => {\n`;
    code += `  return (\n    <div>\n`;

    items.forEach((item) => {
      if (item.type === 'button') {
        code += `      <button onClick={() => ${item.props.action || ''}}>${item.props.text || 'Button'}</button>\n`;
      } else if (item.type === 'textfield') {
        code += `      <input type="text" placeholder="${item.props.placeholder || ''}" />\n`;
      }
    });

    code += `    </div>\n  );\n};\n\n`;
    code += `export default ExportedComponent;`;

    return code;
  };

  const handleExport = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ExportedComponent.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 border-l">
      <Button onClick={handleExport}>Export Code</Button>
    </div>
  );
};

