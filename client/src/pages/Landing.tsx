import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, Sparkles } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-primary-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <Brain className="text-white" size={32} />
          </div>
          
          {/* Title */}
          <div>
            <h1 className="hero-title mb-4">
              <span className="text-white">Learn</span>
              <br />
              <span className="gradient-text">Everything™</span>
            </h1>
            
            <p className="text-gray-400 text-base leading-relaxed">
              Experience the profound power of knowledge acquisition.
              Crafted with meticulous attention to learning.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <Card className="nothing-card border-accent-purple/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                  <Sparkles className="text-accent-purple" size={20} />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">AI 맞춤 학습</h3>
                  <p className="text-gray-400 text-sm">개인화된 학습 경험</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="nothing-card border-accent-purple/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center">
                  <Brain className="text-accent-blue" size={20} />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">실시간 진도 추적</h3>
                  <p className="text-gray-400 text-sm">학습 현황을 한눈에</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-4 px-6 floating-action rounded-xl text-white font-semibold flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform"
          data-testid="button-login"
        >
          <span>시작하기</span>
          <ArrowRight size={20} />
        </button>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs">
          <p>Made with Nothing™ design philosophy</p>
        </div>
      </div>
    </div>
  );
}
