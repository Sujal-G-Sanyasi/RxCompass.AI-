export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-full max-w-md px-4">
        <div className="relative flex justify-center mb-8">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping-slow" />
          <div className="relative z-10">
            <svg
              viewBox="0 0 64 64"
              className="w-32 h-32 text-rose-500 animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(244, 63, 94, 0.6))',
                animationDuration: '1.5s'
              }}
            >
              <path
                d="M32 54s-9.5-6.7-15-12.1C11.2 36.3 8 32.4 8 27.7 8 21 13.1 16 19.7 16c3.6 0 7 1.7 9.3 4.6C31.3 17.7 34.7 16 38.3 16 44.9 16 50 21 50 27.7c0 4.7-3.2 8.6-9 14.2C41.5 47.3 32 54 32 54z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
            Analyzing Medical Data
          </h3>
          <p className="text-muted-foreground">
            <span className="typewriter">Synthesizing silhouette-driven diagnosis…</span>
          </p>
        </div>
        
        {/* Heart Rate Pulse Animation */}
        <div className="mt-8 h-24 relative">
          <svg 
            viewBox="0 0 300 80" 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Static faint baseline so the signal never fully disappears */}
            <path
              d="M0,40 L300,40"
              fill="none"
              stroke="url(#pulseGradient)"
              strokeWidth="2"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />

            {/* Animated ECG pulse over the baseline */}
            <path 
              d="M0,40 L40,40 L55,40 L65,20 L75,55 L85,30 L100,40 L130,40 L145,40 L155,18 L165,60 L178,32 L195,40 L225,40 L235,40 L245,22 L255,52 L265,35 L280,40 L300,40" 
              fill="none" 
              stroke="url(#pulseGradient)" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset="600"
              className="animate-draw"
              style={{
                filter: 'drop-shadow(0 0 5px rgba(244, 63, 94, 0.5))'
              }}
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>
      </div>
    </div>
  );
};
