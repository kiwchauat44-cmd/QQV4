import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Eye, EyeOff, Layers, Waves, 
  Share2, Target, Sparkles, RefreshCw
} from 'lucide-react';

interface QuantumUIProps {
  settings: {
    isQuantumEnergyView: boolean;
    showProbabilityCloud: boolean;
    showEntanglement: boolean;
    isWaveMode: boolean;
    measurementActive: boolean;
  };
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onMeasure: () => void;
  onCollapse: () => void;
}

export default function QuantumUI({ 
  settings, 
  setSettings,
  onMeasure,
  onCollapse
}: QuantumUIProps) {
  const toggleSetting = (key: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Primary Actions */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMeasure}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition-all group"
        >
          <Target className="group-hover:scale-110 transition-transform" size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Measure All</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCollapse}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500/30 transition-all group"
        >
          <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Collapse State</span>
        </motion.button>
      </div>

      {/* Visualization Toggles */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 grid grid-cols-3 gap-2">
        <ToggleButton 
          active={settings.isWaveMode} 
          onClick={() => toggleSetting('isWaveMode')}
          icon={settings.isWaveMode ? <Waves size={18} /> : <Sparkles size={18} />}
          label={settings.isWaveMode ? "Wave" : "Particle"}
        />
        <ToggleButton 
          active={settings.showProbabilityCloud} 
          onClick={() => toggleSetting('showProbabilityCloud')}
          icon={<Layers size={18} />}
          label="Cloud"
        />
        <ToggleButton 
          active={settings.isQuantumEnergyView} 
          onClick={() => toggleSetting('isQuantumEnergyView')}
          icon={<Zap size={18} />}
          label="Energy"
        />
        <ToggleButton 
          active={settings.showEntanglement} 
          onClick={() => toggleSetting('showEntanglement')}
          icon={<Share2 size={18} />}
          label="Links"
        />
        <ToggleButton 
          active={settings.measurementActive} 
          onClick={() => toggleSetting('measurementActive')}
          icon={settings.measurementActive ? <Eye size={18} /> : <EyeOff size={18} />}
          label="Observe"
        />
        <div className="flex flex-col items-center justify-center p-2 opacity-20">
          <Info size={14} className="text-white" />
          <span className="text-[8px] uppercase mt-1 text-white">Scale</span>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all ${
        active 
          ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
          : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function Info({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
