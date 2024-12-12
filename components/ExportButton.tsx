import { Button } from "@/components/ui/button";
import { ComponentItem } from '@/types/ComponentItem';
import React from 'react';

interface ExportButtonProps {
  items: ComponentItem[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ items }) => {
  const generateFrontendCode = () => {
    let code = `import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

`;
    code += `const ExportedComponent = () => {
`;
    code += `  return (
    <div>
`;

    items.forEach((item) => {
      switch (item.type) {
        case 'button':
          code += `      <Button onClick={() => ${item.props.action || ''}}>${item.props.text || 'Button'}</Button>
`;
          break;
        case 'textfield':
          code += `      <Input placeholder="${item.props.placeholder || ''}" />
`;
          break;
        case 'modal':
          code += `      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Modal</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>${item.props.title || 'Modal Title'}</DialogTitle>
            <DialogDescription>${item.props.content || 'Modal Content'}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
`;
          break;
        case 'card':
          code += `      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>${item.props.title || 'Card Title'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>${item.props.content || 'Card Content'}</p>
        </CardContent>
      </Card>
`;
          break;
        case 'expandable-list':
          code += `      <Accordion type="single" collapsible className="w-full">
`;
          (item.props.items || ['Item 1', 'Item 2', 'Item 3']).forEach((listItem, index) => {
            code += `        <AccordionItem value="item-${index}">
          <AccordionTrigger>${listItem}</AccordionTrigger>
          <AccordionContent>Content for ${listItem}</AccordionContent>
        </AccordionItem>
`;
          });
          code += `      </Accordion>
`;
          break;
      }
    });

    code += `    </div>
  );
};

`;
    code += `export default ExportedComponent;`;

    return code;
  };

  const generateBackendCode = async () => {
    const frontendCode = generateFrontendCode();
    try {
      const response = await fetch('/api/generate-backend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frontendCode }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to generate backend code');
      }
    
      const backendCode = await response.text();
      return backendCode;
    } catch (error) {
      console.error('Error generating backend code:', error);
      return 'Error generating backend code. Please try again.';
    }
  };

  const handleExportFrontend = () => {
    const code = generateFrontendCode();
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

  const handleExportBackend = async () => {
    try {
      const code = await generateBackendCode();
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ExportedComponentBackend.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting backend code:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="p-4 border-l">
      <div className="flex flex-col gap-4">
        <Button onClick={handleExportFrontend}>Export Frontend Code</Button>
        <Button onClick={handleExportBackend}>Export Backend AI Code</Button>
      </div>
    </div>
  );
};

