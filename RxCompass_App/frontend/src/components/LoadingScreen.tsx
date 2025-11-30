import { Activity, Brain, Sparkles } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-8">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-2xl animate-pulse" 
             style={{ width: '200px', height: '200px', left: '-40px', top: '-40px' }} />
        
        {/* Middle rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin" 
             style={{ width: '120px', height: '120px' }} />
        
        {/* Inner pulsing gradient circle */}
        <div className="relative p-8 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/50 to-accent/50 blur-xl" />
          <Activity className="h-16 w-16 text-primary-foreground animate-pulse relative z-10" strokeWidth={2.5} />
        </div>
        
        {/* Floating sparkles */}
        <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-accent animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }} />
        <Sparkles className="absolute -bottom-4 -left-4 h-6 w-6 text-primary animate-bounce" style={{ animationDelay: '400ms', animationDuration: '2s' }} />
        <Brain className="absolute top-0 left-12 h-7 w-7 text-accent/70 animate-pulse" style={{ animationDelay: '200ms' }} />
      </div>
      
      <div className="text-center space-y-4 max-w-md">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
          Analyzing Patient Data
        </h3>
        <p className="text-base text-muted-foreground">
          Our AI model is processing your dataset with advanced machine learning algorithms
        </p>
        
        {/* Loading dots animation */}
        <div className="flex justify-center items-center space-x-2 pt-4">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent animate-bounce" 
               style={{ animationDelay: '0ms', animationDuration: '1s' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-primary animate-bounce" 
               style={{ animationDelay: '200ms', animationDuration: '1s' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent animate-bounce" 
               style={{ animationDelay: '400ms', animationDuration: '1s' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-primary animate-bounce" 
               style={{ animationDelay: '600ms', animationDuration: '1s' }} />
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-secondary/20 rounded-full h-2 overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-pulse" 
               style={{ width: '70%', transition: 'width 0.3s ease' }} />
        </div>
      </div>
    </div>
  );
};
