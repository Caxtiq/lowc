import { Button } from "@/components/ui/button";
import { ComponentItem } from '@/types/ComponentItem';
import React from 'react';

interface ExportButtonProps {
  items: ComponentItem[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ items }) => {
  const generateCode = () => {
    let code = `import React from 'react';\n`;
    code += `import { Button } from "@/components/ui/button";\n`;
    code += `import { Input } from "@/components/ui/input";\n`;
    code += `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";\n`;
    code += `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";\n`;
    code += `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";\n\n`;
    code += `const ExportedComponent = () => {\n`;
    code += `  return (\n    <div>\n`;

    items.forEach((item) => {
      switch (item.type) {
        case 'button':
          code += `      <Button onClick={() => ${item.props.action || ''}}>${item.props.text || 'Button'}</Button>\n`;
          break;
        case 'textfield':
          code += `      <Input placeholder="${item.props.placeholder || ''}" />\n`;
          break;
        case 'modal':
          code += `      <Dialog>\n`;
          code += `        <DialogTrigger asChild>\n`;
          code += `          <Button variant="outline">Open Modal</Button>\n`;
          code += `        </DialogTrigger>\n`;
          code += `        <DialogContent className="sm:max-w-[425px]">\n`;
          code += `          <DialogHeader>\n`;
          code += `            <DialogTitle>${item.props.title || 'Modal Title'}</DialogTitle>\n`;
          code += `            <DialogDescription>${item.props.content || 'Modal Content'}</DialogDescription>\n`;
          code += `          </DialogHeader>\n`;
          code += `        </DialogContent>\n`;
          code += `      </Dialog>\n`;
          break;
        case 'card':
          code += `      <Card className="w-[350px]">\n`;
          code += `        <CardHeader>\n`;
          code += `          <CardTitle>${item.props.title || 'Card Title'}</CardTitle>\n`;
          code += `        </CardHeader>\n`;
          code += `        <CardContent>\n`;
          code += `          <p>${item.props.content || 'Card Content'}</p>\n`;
          code += `        </CardContent>\n`;
          code += `      </Card>\n`;
          break;
        case 'expandable-list':
          code += `      <Accordion type="single" collapsible className="w-full">\n`;
          (item.props.items || ['Item 1', 'Item 2', 'Item 3']).forEach((listItem, index) => {
            code += `        <AccordionItem value="item-${index}">\n`;
            code += `          <AccordionTrigger>${listItem}</AccordionTrigger>\n`;
            code += `          <AccordionContent>Content for ${listItem}</AccordionContent>\n`;
            code += `        </AccordionItem>\n`;
          });
          code += `      </Accordion>\n`;
          break;
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

