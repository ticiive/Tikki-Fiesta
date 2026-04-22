import React, { ReactNode } from 'react';
import { SeaBackground } from './SeaBackground';

interface IslandLayoutProps {
  children: ReactNode;
}

/**
 * IslandLayout - Main app wrapper with tropical sea background + wooden frame
 * Creates a "deck of beach" style frame around content
 */
export const IslandLayout: React.FC<IslandLayoutProps> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-turquoise">
      {/* Animated sea background */}
      <SeaBackground />

      {/* Wooden frame wrapper - content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
          {/* Outer wooden frame border */}
          <div
            className="rounded-[2.5rem] bg-areia shadow-2xl border-8"
            style={{
              borderColor: '#E8D5B7',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.3)',
              backgroundColor: '#F4E4C1',
            }}
          >
            {/* Inner padding container */}
            <div className="p-3 md:p-4 h-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements - top corners */}
      <div className="fixed top-8 left-8 z-20 opacity-60">
        <div className="text-5xl animate-bounce" style={{ animationDelay: '0s' }}>
          🥥
        </div>
      </div>
      <div className="fixed top-12 right-8 z-20 opacity-60">
        <div className="text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>
          🌺
        </div>
      </div>

      {/* Floating decorative elements - bottom corners */}
      <div className="fixed bottom-8 left-12 z-20 opacity-40">
        <div className="text-4xl animate-bounce" style={{ animationDelay: '1s' }}>
          🌴
        </div>
      </div>
      <div className="fixed bottom-12 right-12 z-20 opacity-50">
        <div className="text-5xl animate-bounce" style={{ animationDelay: '1.5s' }}>
          ⛱️
        </div>
      </div>
    </div>
  );
};
