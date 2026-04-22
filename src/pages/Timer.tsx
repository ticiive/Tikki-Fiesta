import { Timer as TimerIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TropicalBackground } from "@/components/layout/TropicalBackground";

const Timer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-6">
      <TropicalBackground />
      <TimerIcon className="w-16 h-16 text-tangerine mb-4" />
      <h1 className="text-3xl font-bold text-cobalt mb-2">Timer</h1>
      <p className="text-muted-foreground font-semibold">Em breve...</p>
    </div>
  );
};

export default Timer;
