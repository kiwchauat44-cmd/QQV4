import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Flame, Sun, Waves, Atom, Database, 
  Activity, Globe, Magnet, Cpu, Sparkles, 
  Play, RefreshCw, History, Settings2, 
  ChevronRight, ChevronLeft, Info, Beaker
} from 'lucide-react';
import { ParticleType, CollisionResult, CollisionEffectType } from '../../types';

interface CollisionLabProps {
  onStartCollision: (typeA: ParticleType, typeB?: ParticleType, config?: any) => void;
  history: CollisionResult[];
  onReset: () => void;
}

const COLLISION_TYPES: { id: ParticleType; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'electric', label: 'Electricity', icon: Zap, color: '#00ffff', desc: 'High voltage discharge' },
  { id: 'energy', label: 'Heat', icon: Flame, color: '#ff4400', desc: 'Thermal kinetic energy' },
  { id: 'photon', label: 'Light', icon: Sun, color: '#ffff00', desc: 'Electromagnetic radiation' },
  { id: 'plasma', label: 'Plasma', icon: Activity, color: '#ff00ff', desc: 'Ionized matter state' },
  { id: 'light-atom', label: 'Atom', icon: Atom, color: '#00ffcc', desc: 'Stable atomic structure' },
  { id: 'nuclear', label: 'Nucleus', icon: Database, color: '#ffcc00', desc: 'Dense nuclear core' },
  { id: 'matter', label: 'Matter', icon: Globe, color: '#ffffff', desc: 'Standard physical substance' },
  { id: 'cosmic', label: 'Cosmic Energy', icon: Sparkles, color: '#6600ff', desc: 'High-energy space radiation' },
  { id: 'universal', label: 'Dark Energy', icon: Magnet, color: '#330066', desc: 'Expansionary force' },
  { id: 'dark-matter', label: 'Dark Matter', icon: Cpu, color: '#111111', desc: 'Invisible gravitational mass' },
  { id: 'quark', label: 'Exotic Matter', icon: Beaker, color: '#ff0066', desc: 'Speculative subatomic particles' },
];

const CollisionLab: React.FC<CollisionLabProps> = ({ onStartCollision, history, onReset }) => {
  const [mode, setMode] = useState<'1vs1' | 'multi'>('1vs1');
  const [selectedA, setSelectedA] = useState<ParticleType>('electric');
  const [selectedB, setSelectedB] = useState<ParticleType>('matter');
  const [selectedMulti, setSelectedMulti] = useState<ParticleType[]>(['electric', 'matter']);
  const [showHistory, setShowHistory] = useState(false);
  const [setup, setSetup] = useState({
    energyLevel: 0.5,
    phase: 0,
    spin: 0,
    coherence: 0.8,
    probabilitySpread: 0.3
  });

  const handleStart = () => {
    if (mode === '1vs1') {
      onStartCollision(selectedA, selectedB, setup);
    } else {
      onStartCollision(selectedMulti, undefined, setup);
    }
  };

  const toggleMulti = (id: ParticleType) => {
    setSelectedMulti(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Mode Selector */}
      <div className="flex bg-black/40 rounded-xl p-1 mb-4 border border-white/10 self-center">
        <button 
          onClick={() => setMode('1vs1')}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${mode === '1vs1' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-white/40 hover:text-white'}`}
        >
          1-vs-1 COLLISION
        </button>
        <button 
          onClick={() => setMode('multi')}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'multi' ? 'bg-purple-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'text-white/40 hover:text-white'}`}
        >
          MULTI-COLLISION
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Setup Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
              <Settings2 size={14} />
              Pre-Collision Parameters
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Energy Level', key: 'energyLevel', icon: Zap },
                { label: 'Phase Coherence', key: 'coherence', icon: Activity },
                { label: 'Prob. Spread', key: 'probabilitySpread', icon: Waves },
              ].map(param => (
                <div key={param.key} className="space-y-1">
                  <div className="flex justify-between text-[8px] uppercase text-white/40">
                    <span className="flex items-center gap-1"><param.icon size={10} /> {param.label}</span>
                    <span>{(setup as any)[param.key].toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01"
                    value={(setup as any)[param.key]}
                    onChange={(e) => setSetup({...setup, [param.key]: parseFloat(e.target.value)})}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
              <Beaker size={14} />
              Particle Selection
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {COLLISION_TYPES.map(type => {
                const isSelected = mode === '1vs1' 
                  ? (selectedA === type.id || selectedB === type.id)
                  : selectedMulti.includes(type.id);
                
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      if (mode === '1vs1') {
                        if (selectedA === type.id) return;
                        setSelectedB(selectedA);
                        setSelectedA(type.id);
                      } else {
                        toggleMulti(type.id);
                      }
                    }}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected 
                        ? 'bg-white/20 border-white/40 shadow-lg scale-105' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                    title={type.desc}
                  >
                    <type.icon size={16} style={{ color: type.color }} />
                    <span className="text-[7px] font-bold uppercase truncate w-full text-center px-1">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visual Preview / Status */}
        <div className="bg-black/40 rounded-2xl p-6 border border-white/10 mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
          <div className="relative z-10 flex items-center justify-around h-32">
            {mode === '1vs1' ? (
              <>
                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    {(() => {
                      const TypeA = COLLISION_TYPES.find(t => t.id === selectedA)?.icon || Atom;
                      return <TypeA size={32} className="text-cyan-400" />;
                    })()}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">{selectedA}</span>
                </div>
                <div className="text-2xl font-black italic text-white/20">VS</div>
                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    {(() => {
                      const TypeB = COLLISION_TYPES.find(t => t.id === selectedB)?.icon || Atom;
                      return <TypeB size={32} className="text-purple-400" />;
                    })()}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">{selectedB}</span>
                </div>
              </>
            ) : (
              <div className="flex gap-4 flex-wrap justify-center">
                {selectedMulti.map(id => {
                  const type = COLLISION_TYPES.find(t => t.id === id);
                  if (!type) return null;
                  return (
                    <div key={id} className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <type.icon size={20} style={{ color: type.color }} />
                      </div>
                      <span className="text-[8px] font-bold uppercase opacity-40">{type.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-3 mt-auto pt-4 border-t border-white/10">
        <button 
          onClick={onReset}
          className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Reset Lab
        </button>
        <button 
          onClick={handleStart}
          className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black text-sm font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
        >
          <Play size={20} fill="currentColor" />
          Initiate Collision
        </button>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`w-14 rounded-2xl border flex items-center justify-center transition-all ${showHistory ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
        >
          <History size={20} />
        </button>
      </div>

      {/* History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute inset-y-0 right-0 w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 p-6 z-50 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <History className="text-cyan-400" size={18} />
                Collision Logs
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="space-y-4 overflow-y-auto h-[calc(100%-4rem)] pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20 gap-4">
                  <Beaker size={48} strokeWidth={1} />
                  <p className="text-[10px] uppercase tracking-widest font-bold">No experiments logged</p>
                </div>
              ) : (
                history.map(result => (
                  <div key={result.id} className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-cyan-400 uppercase">{result.outcome}</span>
                      <span className="text-[8px] text-white/20">{new Date(result.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <div className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-bold uppercase">{result.typeA}</div>
                      {result.typeB && <div className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-bold uppercase">{result.typeB}</div>}
                    </div>
                    <p className="text-[9px] text-white/60 leading-relaxed mb-3">{result.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/40 rounded p-1.5 flex flex-col">
                        <span className="text-[6px] uppercase text-white/30">Stability</span>
                        <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${result.stability * 100}%` }} />
                        </div>
                      </div>
                      <div className="bg-black/40 rounded p-1.5 flex flex-col">
                        <span className="text-[6px] uppercase text-white/30">Energy Δ</span>
                        <span className={`text-[8px] font-bold ${result.energyChange > 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
                          {result.energyChange > 0 ? '+' : ''}{result.energyChange.toFixed(1)} MeV
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollisionLab;
