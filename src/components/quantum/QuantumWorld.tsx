import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Activity, Zap, Eye, EyeOff, Layers, 
  Waves, Atom, Share2, Info, Maximize2, Minimize2,
  Beaker, FlaskConical, History
} from 'lucide-react';
import QuantumUI from './QuantumUI';
import CollisionLab from './CollisionLab';
import CollisionResultPanel from './CollisionResult';
import { CollisionResult, ParticleType } from '../../types';

interface QuantumWorldProps {
  isOpen: boolean;
  onClose: () => void;
  quantumSettings: {
    isQuantumEnergyView: boolean;
    showProbabilityCloud: boolean;
    showEntanglement: boolean;
    isWaveMode: boolean;
    measurementActive: boolean;
  };
  setQuantumSettings: React.Dispatch<React.SetStateAction<any>>;
  onMeasure: () => void;
  onCollapse: () => void;
  collisionHistory: CollisionResult[];
  activeCollisionResult: CollisionResult | null;
  setActiveCollisionResult: (result: CollisionResult | null) => void;
  onStartCollision: (typeA: ParticleType, typeB?: ParticleType, setup?: any) => void;
  onResetLab: () => void;
}

export default function QuantumWorld({ 
  isOpen, 
  onClose, 
  quantumSettings, 
  setQuantumSettings,
  onMeasure,
  onCollapse,
  collisionHistory,
  activeCollisionResult,
  setActiveCollisionResult,
  onStartCollision,
  onResetLab
}: QuantumWorldProps) {
  const [activeTab, setActiveTab] = React.useState<'simulation' | 'lab'>('simulation');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col pointer-events-none"
        >
          {/* Immersive Background Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none" />
          
          {/* Atmospheric Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Header */}
          <div className="relative z-10 p-4 flex justify-between items-center pointer-events-auto">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Atom className="text-cyan-400 animate-spin-slow" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black italic tracking-tighter text-white glow-text">QUANTUM WORLD</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[8px] uppercase tracking-[0.3em] text-cyan-400/60 font-bold">Subatomic Laboratory</span>
                </div>
              </div>
            </motion.div>

            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="relative z-10 flex justify-center mt-2 pointer-events-auto">
            <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-xl">
              <button 
                onClick={() => setActiveTab('simulation')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'simulation' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white'}`}
              >
                <Activity size={14} />
                Simulation
              </button>
              <button 
                onClick={() => setActiveTab('lab')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'lab' ? 'bg-purple-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-white/40 hover:text-white'}`}
              >
                <FlaskConical size={14} />
                Collision Lab
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative flex flex-col p-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'lab' && (
                <motion.div 
                  key="lab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full pointer-events-auto"
                >
                  <CollisionLab 
                    onStartCollision={onStartCollision}
                    history={collisionHistory}
                    onReset={onResetLab}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collision Result Overlay */}
            <AnimatePresence>
              {activeCollisionResult && (
                <div className="absolute inset-0 flex items-center justify-center z-50 p-6 pointer-events-none">
                  <CollisionResultPanel 
                    result={activeCollisionResult}
                    onClose={() => setActiveCollisionResult(null)}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Quantum Controls Panel (Only in simulation mode) */}
          <AnimatePresence>
            {activeTab === 'simulation' && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="relative z-10 p-4 pb-8 pointer-events-auto"
              >
                <QuantumUI 
                  settings={quantumSettings} 
                  setSettings={setQuantumSettings}
                  onMeasure={onMeasure}
                  onCollapse={onCollapse}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Bar */}
          <div className="relative z-10 px-6 py-2 bg-black/40 backdrop-blur-md border-t border-white/5 flex justify-between items-center text-[8px] uppercase tracking-[0.2em] text-white/30">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><Activity size={10} /> Coherence: 99.9%</span>
              <span className="flex items-center gap-1"><Share2 size={10} /> Entanglement: Active</span>
            </div>
            <div className="flex gap-4">
              <span>Resolution: Planck Scale</span>
              <span className="text-cyan-400/60">Observation Mode: Active</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
