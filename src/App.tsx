import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OrientationOverlay from "./components/OrientationOverlay";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Sorteio from "./pages/Sorteio";
import Timer from "./pages/Timer";
import Ranking from "./pages/Ranking";
import MinigameRanking from "./pages/MinigameRanking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
<QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter basename="/pop-board-play">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<Index />} />
        <Route path="/game" element={<Game />} />
        <Route path="/sorteio" element={<Sorteio />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/minigame-ranking" element={<MinigameRanking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;
