import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { GlobalConfigButton } from "@/components/GlobalConfigButton";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Sorteio from "./pages/Sorteio";
import Timer from "./pages/Timer";
import Ranking from "./pages/Ranking";
import RankingMinigame from "./pages/RankingMinigame";
import ComoJogar from "./pages/ComoJogar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <MusicProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BackgroundMusic />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <GlobalConfigButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Game />} />
            <Route path="/sorteio" element={<Sorteio />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/ranking-minigame" element={<RankingMinigame />} />
            <Route path="/como-jogar" element={<ComoJogar />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </MusicProvider>
);

export default App;
