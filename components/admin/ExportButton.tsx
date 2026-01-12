'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  endpoint: string;
  filename?: string;
}

export function ExportButton({ endpoint, filename }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the filename from the response headers or use the provided one
      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFilename = filename || 'export.xlsx';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          downloadFilename = match[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      isLoading={isLoading}
    >
      <Download className="h-4 w-4 mr-2" />
      Export to Excel
    </Button>
  );
}
