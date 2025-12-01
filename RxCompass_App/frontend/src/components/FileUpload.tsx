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
    <Card className="group p-8 rounded-2xl border border-border/60 hover:border-primary/80 bg-card/60 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(56,189,248,0.45)]">
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
          className="flex flex-col items-center justify-center cursor-pointer space-y-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl transition-all duration-300"
        >
          <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary/25 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] transition-all duration-300 ease-out transform group-hover:scale-105">
            {fileName ? (
              <FileSpreadsheet className="h-12 w-12 text-primary" />
            ) : (
              <Upload className="h-12 w-12 text-primary" />
            )}
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground tracking-wide group-hover:text-primary transition-colors duration-300">
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
