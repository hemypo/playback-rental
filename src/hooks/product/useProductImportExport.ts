
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  exportProductsToCSV,
  importProductsFromCSV
} from "@/services/productCsvService";

export const useProductImportExport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const csvContent = await exportProductsToCSV();
      
      // Set proper encoding for Russian characters
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Экспорт завершен",
        description: "Продукты успешно экспортированы в CSV",
      });
    } catch (error) {
      toast({
        title: "Ошибка экспорта",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setIsLoading(true);
      
      // Enhanced logging to track the import process
      console.log(`Starting CSV import for file: ${file.name} (${file.size} bytes)`);
      
      // Read the file content as text with encoding detection
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Get the result and pass it to the processing function
          const content = e.target?.result as string;
          resolve(content);
        };
        reader.onerror = (e) => {
          console.error("Error reading CSV file:", e);
          reject(new Error("Failed to read the CSV file"));
        };
        reader.readAsText(file);
      });
      
      console.log(`File read successfully, size: ${fileContent.length} bytes`);
      console.log(`First 100 characters: ${fileContent.substring(0, 100)}`);

      // Now pass the string content to importProductsFromCSV
      const importedProducts = await importProductsFromCSV(fileContent);
      
      console.log(`Import completed successfully. Imported ${importedProducts.length} products`);
      if (importedProducts.length > 0) {
        console.log("Sample imported product:", importedProducts[0]);
        console.log("Image URL in sample:", importedProducts[0].imageurl || "No image URL");
      }
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      toast({
        title: "Импорт завершен",
        description: `Успешно импортировано ${importedProducts.length} товаров`,
      });
    } catch (error) {
      console.error("Error in handleImport:", error);
      toast({
        title: "Ошибка импорта",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleExport,
    handleImport
  };
};
