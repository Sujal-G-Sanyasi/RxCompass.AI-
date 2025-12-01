import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RxCompassLogo from "@/assets/RxCompass_image.png";
import lightningImage from "@/assets/lightning.jpg";
import secureImage from "@/assets/secure.jpg";
import analyticsImage from "@/assets/analytics.jpg";
import { useEffect } from "react";

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-gradient-to-br hover:from-blue-500/10 hover:via-purple-500/10 hover:to-pink-500/10 hover:border-blue-400/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.3),0_0_50px_rgba(147,51,234,0.2)] hover:-rotate-1 transition-all duration-300 transform hover:scale-105">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-4 overflow-hidden hover:from-blue-400/30 hover:to-purple-400/40 transition-all duration-300">
      {icon.startsWith('http') || icon.includes('/') ? (
        <img src={icon} alt={title} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl">{icon}</span>
      )}
    </div>
    <h3 className="text-lg font-semibold mb-2 hover:text-blue-300 transition-colors duration-300">{title}</h3>
    <p className="text-muted-foreground text-sm hover:text-gray-200 transition-colors duration-300">{description}</p>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [buttonTypeKey, setButtonTypeKey] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("neon-dark");
  }, []);

  return (
    <div className="min-h-screen bg-background neon-dark">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div
          className="inline-flex items-center gap-3 px-4 py-6 rounded-lg border border-white/10 group transition-all duration-300 hover:border-blue-400/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transform hover:scale-105"
        >
          <img
            src={RxCompassLogo}
            alt="RxCompass logo"
            className="h-16 w-16 object-contain rounded-full cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_26px_rgba(59,130,246,0.9)]"
          />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(129,140,248,0.9)] group-hover:brightness-110">
            RxCompass.AI
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI-Powered Diagnosis
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block mb-3">RxCompass.AI</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Your Seamless Diagnosis
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the future of medical diagnostics with our AI-powered platform.
            Get instant, accurate analysis without the need for sign-ups or logins.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={(e) => {
                const button = e.currentTarget;
                button.classList.add('scale-95');
                setTimeout(() => {
                  navigate("/analyze");
                }, 150);
              }}
              onMouseEnter={() => setButtonTypeKey((k) => k + 1)}
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                         transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              <span key={buttonTypeKey} className="typewriter-button">Let's Diagnose</span>
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-400">
            No credit card required • Instant results • Secure & private
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard 
            icon={lightningImage}
            title="Lightning Fast"
            description="Get instant analysis with our advanced AI algorithms processing data in real-time."
          />
          <FeatureCard 
            icon={secureImage}
            title="Secure & Private"
            description="Your data never leaves your browser. We prioritize your privacy and security."
          />
          <FeatureCard 
            icon={analyticsImage}
            title="Comprehensive Analysis"
            description="Detailed insights and visualizations to help you understand the results."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} RxCompass.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


