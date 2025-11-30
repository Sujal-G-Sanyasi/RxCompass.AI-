import { Upload, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload = ({ onFileSelect, isLoading }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }
    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <Card className="p-8 border-2 border-dashed hover:border-primary transition-all duration-300">
      <div
        className={`relative ${dragActive ? "opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv"
          onChange={handleChange}
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer space-y-4"
        >
          <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {fileName ? (
              <FileSpreadsheet className="h-12 w-12 text-primary" />
            ) : (
              <Upload className="h-12 w-12 text-primary" />
            )}
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">
              {fileName || "Upload Patient Dataset"}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop your CSV file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported format: CSV with 82+ features
            </p>
          </div>
        </label>
      </div>
    </Card>
  );
};
