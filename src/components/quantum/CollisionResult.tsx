import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Activity, Shield, Sparkles, 
  TrendingUp, TrendingDown, AlertTriangle, 
  Layers, Share2, Info, Atom
} from 'lucide-react';
import { CollisionResult } from '../../types';

interface CollisionResultPanelProps {
  result: CollisionResult;
  onClose: () => void;
}

const CollisionResultPanel: React.FC<CollisionResultPanelProps> = ({ result, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="bg-black/80 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-2xl max-w-md w-full pointer-events-auto"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black italic text-cyan-400 glow-text uppercase tracking-tighter">
            {result.outcome}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Collision Analysis Result</p>
        </div>
        <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30 text-[10px] font-bold text-cyan-400">
          ID: {result.id.slice(0, 8)}
        </div>
      </div>

      <div className="space-y-6">
        {/* Description */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-white/80 leading-relaxed italic">
            "{result.description}"
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[8px] uppercase text-white/40">Stability</span>
              <Shield size={12} className={result.stability > 0.7 ? 'text-green-400' : 'text-yellow-400'} />
            </div>
            <div className="text-lg font-black text-white">{(result.stability * 100).toFixed(1)}%</div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${result.stability * 100}%` }}
                className={`h-full ${result.stability > 0.7 ? 'bg-green-500' : 'bg-yellow-500'}`}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[8px] uppercase text-white/40">Energy Delta</span>
              {result.energyChange > 0 ? <TrendingUp size={12} className="text-orange-400" /> : <TrendingDown size={12} className="text-cyan-400" />}
            </div>
            <div className={`text-lg font-black ${result.energyChange > 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
              {result.energyChange > 0 ? '+' : ''}{result.energyChange.toFixed(2)} <span className="text-[10px]">MeV</span>
            </div>
            <p className="text-[8px] text-white/20 uppercase">Net energy flux</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[8px] uppercase text-white/40">New Particles</span>
              <Atom size={12} className="text-purple-400" />
            </div>
            <div className="text-lg font-black text-white">+{result.newParticles}</div>
            <p className="text-[8px] text-white/20 uppercase">Fragmentation yield</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[8px] uppercase text-white/40">Quantum State</span>
              <Activity size={12} className="text-cyan-400" />
            </div>
            <div className="text-lg font-black text-white uppercase truncate">{result.events[0] || 'Stable'}</div>
            <p className="text-[8px] text-white/20 uppercase">Primary reaction</p>
          </div>
        </div>

        {/* Quantum Events Timeline */}
        <div className="space-y-2">
          <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Reaction Sequence</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {result.events.map((event, i) => (
              <div key={i} className="flex-shrink-0 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Sparkles size={10} className="text-cyan-400" />
                <span className="text-[9px] font-bold uppercase text-cyan-100">{event}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95"
        >
          Acknowledge & Continue
        </button>
      </div>
    </motion.div>
  );
};

export default CollisionResultPanel;
