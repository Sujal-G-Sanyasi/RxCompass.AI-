import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PredictionResults } from "@/components/PredictionResults";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RxLogo from "@/assets/Rxlogo.avif";
import { useEffect } from "react";

interface Prediction {
  patientId: number;
  prediction: string;
  confidence: number;
  topFeatures: Array<{ feature: string; importance: number }>;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.add("neon-dark");
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setPredictions([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }

      const data = await response.json();
      setPredictions(data.predictions);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully processed ${data.totalPatients} patient records.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      {isLoading && <LoadingScreen />}
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black overflow-hidden">
              <img src={RxLogo} alt="RxCompass logo" className="h-16 w-16 object-contain bg-transparent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">RxCompass</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Disease Prediction System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          {!isLoading && predictions.length === 0 && (
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide">
                <Activity className="h-4 w-4" />
                82+ Features Analysis Engine
              </div>
              <h2 className="text-5xl font-bold text-foreground leading-tight">
                Advanced Medical Diagnostics
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Upload patient datasets in CSV format to receive AI-powered disease predictions. 
                Our system analyzes multiple features to provide accurate diagnostic insights with 
                detailed feature contribution analysis and comprehensive individual patient reports.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Multi-class Disease Classification
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  Feature Importance Ranking
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Individual Patient Reports
                </div>
              </div>
            </div>
          )}

          {/* Capability Highlights */}
          {!isLoading && predictions.length === 0 && (
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              <div className="cap-ml-card rounded-xl border border-border/70 bg-card/60 p-5 text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(59,130,246,0.6)]">
                <h3 className="text-sm font-semibold tracking-wide text-primary uppercase mb-2">
                  ML-Based Diagnosis Model
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  RxCompass uses a stacked ensemble of machine learning models, combining multiple learners into a single, more robust diagnostic signal instead of relying on just one classifier.
                </p>
              </div>

              <div className="cap-82-card rounded-xl border border-border/70 bg-card/60 p-5 text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(147,51,234,0.6)]">
                <h3 className="text-sm font-semibold tracking-wide text-accent uppercase mb-2">
                  82 Feature / Symptoms Diagnosis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each run evaluates more than 82 clinical features and symptoms in parallel, so contributions are scored simultaneously instead of one factor at a time.
                </p>
              </div>

              <div className="cap-batch-card rounded-xl border border-border/70 bg-card/60 p-5 text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(34,197,94,0.6)]">
                <h3 className="text-sm font-semibold tracking-wide text-secondary uppercase mb-2">
                  Batch Processing
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload a full CSV and RxCompass processes patients in batches, avoiding tedious one-by-one inputs and making cohort analysis seamless and easy to use.
                </p>
              </div>
            </div>
          )}

          {/* File Upload */}
          {!isLoading && predictions.length === 0 && (
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          )}

          {/* Loading State */}
          {isLoading && <LoadingScreen />}

          {/* Results */}
          {!isLoading && predictions.length > 0 && (
            <>
              <PredictionResults predictions={predictions} />
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setPredictions([])}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
                >
                  Analyze Another Dataset
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-12 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-xl font-semibold text-foreground">RxCompass</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An AI-powered disease prediction system designed for educational and research purposes. 
              This tool provides diagnostic insights based on machine learning analysis of patient data.
            </p>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Medical Disclaimer: Always consult qualified healthcare professionals for medical decisions. 
                This system is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              © 2025 RxCompass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
