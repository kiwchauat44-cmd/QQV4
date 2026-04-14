import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Zap, CircleDashed, Wind, Bomb, Target, 
  Settings, Layers, Play, Pause, RefreshCcw, 
  Sparkles, Atom, Database, Activity, Globe,
  Flame, Waves, Sun, Magnet, Cpu, ZoomIn, ZoomOut, Search, Move,
  Mountain, Snowflake, Moon, Thermometer, Volume2, ArrowDownCircle,
  PlusCircle, MinusCircle, Star as StarIcon, Droplets, Gem, Skull, Heart, Brain, Cloud
} from 'lucide-react';
import { Particle, Player, Force, ForceType, SimulationMode, ParticleType, Star, CollisionEffect, CollisionEffectType, CollisionResult } from './types';
import QuantumWorld from './components/quantum/QuantumWorld';

const MODES: { id: SimulationMode; label: string; icon: any; desc: string }[] = [
  { id: 'static', label: 'พลังงานคงที่', icon: <Zap size={18} />, desc: 'สนามพลังงานที่เสถียรและสงบ' },
  { id: 'chaos', label: 'โกลาหล', icon: <Activity size={18} />, desc: 'การเคลื่อนที่แบบสุ่มพลังงานสูง' },
  { id: 'aggregation', label: 'การรวมตัว', icon: <Target size={18} />, desc: 'อนุภาคดึงดูดเข้าหากันเพื่อสร้างมวล' },
  { id: 'vortex', label: 'พายุน้ำวน', icon: <RefreshCcw size={18} />, desc: 'กระแสพลังงานหมุนวนรุนแรง' },
  { id: 'explosion', label: 'การระเบิด', icon: <Bomb size={18} />, desc: 'อนุภาคผลักออกจากกันอย่างรุนแรง' },
  { id: 'transformation', label: 'การแปรสภาพ', icon: <Sparkles size={18} />, desc: 'อนุภาคเปลี่ยนสถานะตลอดเวลา' },
  { id: 'big-bang', label: 'บิกแบง', icon: <Sun size={18} />, desc: 'การระเบิดขยายตัวครั้งใหญ่' },
  { id: 'neural-network', label: 'โครงข่ายสมอง', icon: <Cpu size={18} />, desc: 'การเชื่อมต่อพลังงานแบบโครงข่าย' },
  { id: 'black-hole', label: 'หลุมดำ', icon: <CircleDashed size={18} />, desc: 'แรงดึงดูดมหาศาลที่กลืนกินทุกสิ่ง' },
  { id: 'supernova', label: 'ซูเปอร์โนวา', icon: <Flame size={18} />, desc: 'การระเบิดของดาวฤกษ์มวลมหึมา' },
  { id: 'nebula', label: 'เนบิวลา', icon: <Waves size={18} />, desc: 'กลุ่มก๊าซและฝุ่นผงในอวกาศ' },
  { id: 'galaxy', label: 'กาแล็กซี', icon: <Globe size={18} />, desc: 'การก่อตัวของระบบดาวฤกษ์แบบก้นหอย' },
  { id: 'wormhole', label: 'รูหนอน', icon: <Wind size={18} />, desc: 'ทางลัดผ่านกาลอวกาศ' },
  { id: 'pulsar', label: 'พัลซาร์', icon: <Activity size={18} />, desc: 'ดาวนิวตรอนที่หมุนรอบตัวเองด้วยความเร็วสูง' },
  { id: 'dark-energy', label: 'พลังงานมืด', icon: <Layers size={18} />, desc: 'แรงผลักดันที่ทำให้จักรวาลขยายตัว' },
  { id: 'zoom', label: 'โหมดซูมขยาย', icon: <Search size={18} />, desc: 'ลากเพื่อซูมเข้าและออก' },
  { id: 'pan', label: 'โหมดเลื่อน', icon: <Move size={18} />, desc: 'ลากเพื่อเลื่อนมุมมอง' },
  { id: 'spawn-particle', label: 'สร้างอนุภาค', icon: <Atom size={18} />, desc: 'ลากเพื่อสร้างอนุภาคใหม่' },
  { id: 'quantum', label: 'โหมดควอนตัม', icon: <Activity size={18} />, desc: 'จำลองสถานะควอนตัมและการซ้อนทับ' },
];

const ENERGY_CATEGORIES = [
  { id: 'basic', label: 'พลังงานพื้นฐาน', icon: <Flame size={16} /> },
  { id: 'physics', label: 'พลังงานฟิสิกส์', icon: <Zap size={16} /> },
  { id: 'particle', label: 'ระบบอนุภาค', icon: <Atom size={16} /> },
  { id: 'cosmic', label: 'พลังงานจักรวาล', icon: <Globe size={16} /> },
  { id: 'exotic', label: 'สสารพิเศษ', icon: <Sparkles size={16} /> },
];

const ENERGY_TYPES: { id: ForceType; label: string; icon: any; color: string; desc: string; category: string }[] = [
  // Basic
  { id: 'fire', label: 'ไฟ', icon: <Flame size={16} />, color: '#ff4500', desc: 'พลังงานความร้อนที่เผาผลาญ', category: 'basic' },
  { id: 'water', label: 'น้ำ', icon: <Waves size={16} />, color: '#00bfff', desc: 'พลังงานที่ไหลลื่นและเย็นสบาย', category: 'basic' },
  { id: 'wind', label: 'ลม', icon: <Wind size={16} />, color: '#f0f8ff', desc: 'กระแสอากาศที่รวดเร็ว', category: 'basic' },
  { id: 'earth', label: 'ดิน', icon: <Mountain size={16} />, color: '#8b4513', desc: 'พลังงานที่มั่นคงและหนักแน่น', category: 'basic' },
  { id: 'light', label: 'แสง', icon: <Sun size={16} />, color: '#ffffed', desc: 'พลังงานบริสุทธิ์ที่ส่องสว่าง', category: 'basic' },
  { id: 'darkness', label: 'ความมืด', icon: <Moon size={16} />, color: '#4b0082', desc: 'พลังงานที่กลืนกินแสงสว่าง', category: 'basic' },
  { id: 'lightning', label: 'สายฟ้า', icon: <Zap size={16} />, color: '#ffff00', desc: 'ประจุไฟฟ้าแรงสูงที่รวดเร็ว', category: 'basic' },
  { id: 'ice', label: 'น้ำแข็ง', icon: <Snowflake size={16} />, color: '#afeeee', desc: 'พลังงานที่แช่แข็งทุกสิ่ง', category: 'basic' },
  
  // Physics
  { id: 'thermal', label: 'ความร้อน', icon: <Thermometer size={16} />, color: '#ff8c00', desc: 'พลังงานจลน์ระดับโมเลกุล', category: 'physics' },
  { id: 'magnetic', label: 'แม่เหล็ก', icon: <Magnet size={16} />, color: '#c0c0c0', desc: 'แรงดึงดูดและผลักดันทางแม่เหล็ก', category: 'physics' },
  { id: 'electric', label: 'ไฟฟ้า', icon: <Zap size={16} />, color: '#00ffff', desc: 'การไหลของอิเล็กตรอน', category: 'physics' },
  { id: 'sound-wave', label: 'คลื่นเสียง', icon: <Volume2 size={16} />, color: '#ff69b4', desc: 'การสั่นสะเทือนผ่านตัวกลาง', category: 'physics' },
  { id: 'pressure', label: 'ความดัน', icon: <ArrowDownCircle size={16} />, color: '#708090', desc: 'แรงที่กระทำต่อพื้นที่', category: 'physics' },
  { id: 'plasma', label: 'พลาสมา', icon: <Sun size={16} />, color: '#ffa500', desc: 'ก๊าซที่มีประจุไฟฟ้าสูง', category: 'physics' },
  { id: 'gravity', label: 'แรงโน้มถ่วง', icon: <Globe size={16} />, color: '#4682b4', desc: 'แรงดึงดูดระหว่างมวล', category: 'physics' },
  { id: 'shockwave', label: 'คลื่นกระแทก', icon: <Bomb size={16} />, color: '#ff0000', desc: 'คลื่นความดันที่เคลื่อนที่เร็ว', category: 'physics' },

  // Particle
  { id: 'photon', label: 'โฟตอน', icon: <Sun size={16} />, color: '#ffffff', desc: 'อนุภาคของแสง', category: 'particle' },
  { id: 'electron', label: 'อิเล็กตรอน', icon: <Zap size={16} />, color: '#00ffff', desc: 'อนุภาคประจุลบ', category: 'particle' },
  { id: 'proton', label: 'โปรตอน', icon: <PlusCircle size={16} />, color: '#ff0000', desc: 'อนุภาคประจุบวก', category: 'particle' },
  { id: 'neutron', label: 'นิวตรอน', icon: <MinusCircle size={16} />, color: '#808080', desc: 'อนุภาคที่เป็นกลาง', category: 'particle' },
  { id: 'ion', label: 'ไอออน', icon: <CircleDashed size={16} />, color: '#adff2f', desc: 'อะตอมที่มีประจุ', category: 'particle' },
  { id: 'neutrino', label: 'นิวทริโน', icon: <Zap size={16} />, color: '#f0e68c', desc: 'อนุภาคที่มีมวลน้อยมาก', category: 'particle' },
  { id: 'quark', label: 'ควาร์ก', icon: <Sparkles size={16} />, color: '#ff1493', desc: 'อนุภาคพื้นฐานของสสาร', category: 'particle' },
  { id: 'boson', label: 'โบซอน', icon: <Atom size={16} />, color: '#00fa9a', desc: 'อนุภาคตัวกลางของแรง', category: 'particle' },

  // Cosmic
  { id: 'stellar', label: 'พลังงานดาว', icon: <StarIcon size={16} />, color: '#fffacd', desc: 'พลังงานจากดาวฤกษ์', category: 'cosmic' },
  { id: 'solar', label: 'พลังงานสุริยะ', icon: <Sun size={16} />, color: '#ffd700', desc: 'พลังงานจากดวงอาทิตย์', category: 'cosmic' },
  { id: 'lunar', label: 'พลังงานจันทรา', icon: <Moon size={16} />, color: '#f5f5f5', desc: 'พลังงานจากดวงจันทร์', category: 'cosmic' },
  { id: 'cosmic-ray', label: 'รังสีคอสมิก', icon: <Zap size={16} />, color: '#e6e6fa', desc: 'รังสีพลังงานสูงจากอวกาศ', category: 'cosmic' },
  { id: 'nebula', label: 'เนบิวลา', icon: <Cloud size={16} />, color: '#da70d6', desc: 'กลุ่มก๊าซในอวกาศ', category: 'cosmic' },
  { id: 'black-hole', label: 'หลุมดำ', icon: <CircleDashed size={16} />, color: '#000000', desc: 'แรงดึงดูดมหาศาล', category: 'cosmic' },
  { id: 'supernova', label: 'ซูเปอร์โนวา', icon: <Flame size={16} />, color: '#ff4500', desc: 'การระเบิดของดาว', category: 'cosmic' },
  { id: 'dark-matter', label: 'สสารมืด', icon: <Layers size={16} />, color: '#2f4f4f', desc: 'สสารที่มองไม่เห็น', category: 'cosmic' },

  // Exotic
  { id: 'liquid-metal', label: 'โลหะเหลว', icon: <Droplets size={16} />, color: '#778899', desc: 'โลหะในสถานะของเหลว', category: 'exotic' },
  { id: 'crystal', label: 'คริสตัล', icon: <Gem size={16} />, color: '#00ced1', desc: 'ผลึกพลังงาน', category: 'exotic' },
  { id: 'toxic-gas', label: 'ก๊าซพิษ', icon: <Skull size={16} />, color: '#32cd32', desc: 'ก๊าซที่เป็นอันตราย', category: 'exotic' },
  { id: 'radiation', label: 'รังสี', icon: <Activity size={16} />, color: '#ffff00', desc: 'พลังงานที่แผ่ออกมา', category: 'exotic' },
  { id: 'quantum-matter', label: 'สสารควอนตัม', icon: <Cpu size={16} />, color: '#00ffff', desc: 'สสารในระดับควอนตัม', category: 'exotic' },
  { id: 'bio-energy', label: 'พลังงานชีวภาพ', icon: <Heart size={16} />, color: '#ff69b4', desc: 'พลังงานจากสิ่งมีชีวิต', category: 'exotic' },
  { id: 'psionic', label: 'พลังจิต', icon: <Brain size={16} />, color: '#9370db', desc: 'พลังงานจากจิตใจ', category: 'exotic' },
  { id: 'mutating-matter', label: 'สสารแปรผัน', icon: <RefreshCcw size={16} />, color: '#ff00ff', desc: 'สสารที่เปลี่ยนรูปได้', category: 'exotic' },
];

const PRESETS = [
  { name: 'พายุเพลิง', energies: ['fire', 'wind'], mode: 'vortex' as SimulationMode },
  { name: 'ฟ้าผ่ากลางมหาสมุทร', energies: ['lightning', 'water'], mode: 'chaos' as SimulationMode },
  { name: 'การก่อกำเนิดดาว', energies: ['stellar', 'gravity'], mode: 'aggregation' as SimulationMode },
  { name: 'หลุมดำมวลยิ่งยวด', energies: ['black-hole', 'dark-matter'], mode: 'black-hole' as SimulationMode },
  { name: 'พลาสมาความร้อนสูง', energies: ['plasma', 'thermal'], mode: 'explosion' as SimulationMode },
  { name: 'โครงข่ายควอนตัม', energies: ['quantum-matter', 'psionic'], mode: 'neural-network' as SimulationMode },
];

const BEHAVIORS: { id: 'static' | 'pulsate' | 'wander' | 'orbit'; label: string; icon: any }[] = [
  { id: 'static', label: 'คงที่', icon: <Target size={14} /> },
  { id: 'pulsate', label: 'สั่นสะเทือน', icon: <Activity size={14} /> },
  { id: 'wander', label: 'พเนจร', icon: <Wind size={14} /> },
  { id: 'orbit', label: 'โคจร', icon: <RefreshCcw size={14} /> },
];

const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [forces, setForces] = useState<Force[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [modes, setModes] = useState<SimulationMode[]>(['chaos']);
  const [activeEnergies, setActiveEnergies] = useState<ForceType[]>(['electric']);
  const [zoom, setZoom] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedBehavior, setSelectedBehavior] = useState<'static' | 'pulsate' | 'wander' | 'orbit'>('static');
  const [hoveredEnergy, setHoveredEnergy] = useState<ForceType | null>(null);
  const [hoveredMode, setHoveredMode] = useState<SimulationMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [charge, setCharge] = useState(0);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(true);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(true);
  const [isQuantumWorld, setIsQuantumWorld] = useState(false);
  
  // Collision Lab State
  const [collisionHistory, setCollisionHistory] = useState<CollisionResult[]>([]);
  const [activeCollisionResult, setActiveCollisionResult] = useState<CollisionResult | null>(null);

  // Quantum Settings
  const [quantumSettings, setQuantumSettings] = useState({
    isQuantumEnergyView: false,
    showProbabilityCloud: true,
    showEntanglement: true,
    isWaveMode: false,
    measurementActive: false,
  });

  const chargeInterval = useRef<number | null>(null);

  // Simulation Config
  const [config, setConfig] = useState({
    particleCount: isMobile ? 400 : 1000,
    forceStrengthMult: 1.0,
    forceRadiusMult: 1.2,
    speedMult: 1.0,
    glowLevel: isMobile ? 1.5 : 2.0,
    trailLength: 0.15,
    enableCollisions: true,
    stateChangeRate: 0.05,
    aggregationLevel: 1.0,
    explosionLevel: 1.0,
    vortexLevel: 1.0,
    highDefinition: !isMobile
  });

  const handleMeasure = useCallback(() => {
    particlesRef.current.forEach(p => {
      if (Math.random() < 0.8) {
        p.quantumState.isCollapsed = true;
        p.quantumState.coherence *= 0.5;
      }
    });
    shakeRef.current = 5;
    collisionEffectsRef.current.push(new CollisionEffect(window.innerWidth/2, window.innerHeight/2, 'burst', '#00ffff', config.highDefinition));
  }, [config.highDefinition]);

  const handleCollapse = useCallback(() => {
    particlesRef.current.forEach(p => {
      p.quantumState.isCollapsed = true;
      p.quantumState.coherence = 0;
      p.vx *= 0.2;
      p.vy *= 0.2;
    });
    shakeRef.current = 15;
    collisionEffectsRef.current.push(new CollisionEffect(window.innerWidth/2, window.innerHeight/2, 'shockwave', '#ffffff', config.highDefinition));
  }, [config.highDefinition]);

  const toggleQuantumWorld = () => {
    const active = !isQuantumWorld;
    setIsQuantumWorld(active);
    if (active) {
      if (!modes.includes('quantum')) {
        setModes(prev => [...prev, 'quantum']);
      }
    }
  };
  
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const collisionEffectsRef = useRef<CollisionEffect[]>([]);
  const playersRef = useRef<Record<string, Player>>({});
  const forcesRef = useRef<Force[]>([]);
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef<number>(0);
  const isLongPress = useRef(false);
  const lastTouchDist = useRef<number | null>(null);
  const isMouseDown = useRef(false);
  const mouseDownTime = useRef<number>(0);
  const lastInteractionPos = useRef<{ x: number, y: number } | null>(null);
  const spawnStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const shakeRef = useRef<number>(0);

  useEffect(() => {
    if (modes.includes('big-bang')) {
      socketRef.current?.emit('addForce', {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        type: 'universal',
        strength: 600,
        radius: 1200,
        duration: 3000
      });
      
      // Auto-switch to chaos after explosion
      const timer = setTimeout(() => {
        setModes(prev => prev.includes('big-bang') ? [...prev.filter(m => m !== 'big-bang'), 'chaos'] : prev);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [modes]);

  useEffect(() => {
    socketRef.current = io();
    const socket = socketRef.current;

    socket.on('init', ({ playerId, players: initialPlayers, forces: initialForces }) => {
      setPlayerId(playerId);
      setPlayers(initialPlayers);
      setForces(initialForces);
      playersRef.current = initialPlayers;
      forcesRef.current = initialForces;
    });

    socket.on('playerJoined', (player: Player) => {
      setPlayers(prev => {
        const next = { ...prev, [player.id]: player };
        playersRef.current = next;
        return next;
      });
    });

    socket.on('playerMoved', ({ id, x, y }) => {
      setPlayers(prev => {
        if (!prev[id]) return prev;
        const next = { ...prev, [id]: { ...prev[id], x, y } };
        playersRef.current = next;
        return next;
      });
    });

    socket.on('playerLeft', (id) => {
      setPlayers(prev => {
        const { [id]: _, ...rest } = prev;
        playersRef.current = rest;
        return rest;
      });
    });

    socket.on('forceAdded', (force: Force) => {
      setForces(prev => {
        const next = [...prev, force];
        forcesRef.current = next;
        return next;
      });
    });

    socket.on('forceRemoved', (id) => {
      setForces(prev => {
        const next = prev.filter(f => f.id !== id);
        forcesRef.current = next;
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    particlesRef.current = Array.from({ length: config.particleCount }, () => new Particle(canvas.width, canvas.height));
    starsRef.current = Array.from({ length: 100 }, () => new Star(canvas.width, canvas.height));
  }, [config.particleCount]);

  const handleStartCollision = useCallback((types: ParticleType | ParticleType[], typeB?: ParticleType, setup?: any) => {
    // 1. Clear existing particles for a clean lab experiment
    particlesRef.current = [];
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const isMulti = Array.isArray(types);
    const particleTypes = isMulti ? types : [types, typeB].filter(Boolean) as ParticleType[];

    // 2. Spawn test particles
    particleTypes.forEach((type, i) => {
      const p = new Particle(canvas.width, canvas.height);
      p.type = type;
      
      if (isMulti) {
        // Spread around circle for multi-collision
        const angle = (i / particleTypes.length) * Math.PI * 2;
        const dist = 200;
        p.x = centerX + Math.cos(angle) * dist;
        p.y = centerY + Math.sin(angle) * dist;
        p.vx = -Math.cos(angle) * 10;
        p.vy = -Math.sin(angle) * 10;
      } else {
        // Linear 1-vs-1
        p.x = centerX + (i === 0 ? -150 : 150);
        p.y = centerY;
        p.vx = i === 0 ? 8 : -8;
        p.vy = 0;
      }
      
      if (setup) p.quantumState = { ...p.quantumState, ...setup };
      particlesRef.current.push(p);
    });
    
    // 3. Trigger visual effect
    collisionEffectsRef.current.push(new CollisionEffect(centerX, centerY, 'interference', '#00ffff', config.highDefinition));
    
    // 4. Generate a result after a small delay (simulating collision)
    setTimeout(() => {
      const outcomes = [
        "Quantum Entanglement", "Particle Fusion", "Energy Annihilation", 
        "State Superposition", "Decoherence Event", "Tunneling Success",
        "Plasma Excitation", "Dark Matter Interaction", "Quark Gluon Plasma",
        "Higgs Field Perturbation", "String Theory Resonance", "Vacuum Decay (Local)"
      ];
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      const energyChange = (Math.random() - 0.3) * 100;
      const stability = Math.random() * 0.9 + 0.1;
      
      const result: CollisionResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        typeA: particleTypes[0],
        typeB: particleTypes[1],
        outcome,
        energyChange,
        stability,
        newParticles: Math.floor(Math.random() * 15),
        events: ['excitation', 'emission', 'entanglement', 'interference', 'transition', 'tunneling', 'decoherence'].sort(() => 0.5 - Math.random()).slice(0, 4) as CollisionEffectType[],
        description: `The ${isMulti ? 'multi-particle' : '1-vs-1'} collision involving ${particleTypes.join(', ')} resulted in a ${outcome.toLowerCase()}. ${energyChange > 50 ? 'Extreme' : 'Significant'} energy flux detected at the Planck scale with a stability factor of ${stability.toFixed(2)}.`
      };
      
      setActiveCollisionResult(result);
      setCollisionHistory(prev => [result, ...prev].slice(0, 20));
      
      // Trigger final effects
      collisionEffectsRef.current.push(new CollisionEffect(centerX, centerY, 'transition', '#ffffff', config.highDefinition));
      collisionEffectsRef.current.push(new CollisionEffect(centerX, centerY, 'shockwave', '#00ffff', config.highDefinition));
      shakeRef.current = 15;
    }, 1200);
  }, [config.highDefinition]);

  const resetLab = useCallback(() => {
    particlesRef.current = [];
    collisionEffectsRef.current = [];
    setActiveCollisionResult(null);
    initParticles();
  }, [initParticles]);

  // Reaction System
  const checkReactions = useCallback(() => {
    if (activeEnergies.length < 2) return;

    // Fire + Wind = Firestorm
    if (activeEnergies.includes('fire') && activeEnergies.includes('wind')) {
      if (!modes.includes('vortex')) setModes(prev => [...prev, 'vortex']);
    }
    
    // Water + Lightning = Electrified Water
    if (activeEnergies.includes('water') && activeEnergies.includes('lightning')) {
      if (!modes.includes('explosion')) setModes(prev => [...prev, 'explosion']);
      particlesRef.current.forEach(p => {
        if (p.type === 'water') p.hue = 200 + Math.sin(Date.now() * 0.01) * 20;
      });
    }

    // Ice + Fire = Thermal Shock
    if (activeEnergies.includes('ice') && activeEnergies.includes('fire')) {
      shakeRef.current = Math.max(shakeRef.current, 2);
    }

    // Light + Darkness = Annihilation
    if (activeEnergies.includes('light') && activeEnergies.includes('darkness')) {
      if (!modes.includes('big-bang')) setModes(prev => [...prev, 'big-bang']);
    }
  }, [activeEnergies, modes]);

  useEffect(() => {
    const interval = setInterval(checkReactions, 1000);
    return () => clearInterval(interval);
  }, [checkReactions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => {
        const newZoom = prev * delta;
        return Math.min(5, Math.max(0.1, newZoom));
      });
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    resize();

    let animationFrameId: number;

    const render = () => {
      if (!isPaused) {
        // Trail effect
        if (isQuantumWorld) {
          ctx.fillStyle = `rgba(2, 4, 8, ${1 - config.trailLength})`;
        } else {
          ctx.fillStyle = `rgba(5, 5, 10, ${1 - config.trailLength})`;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();

        // Apply Screen Shake
        if (shakeRef.current > 0.1) {
          const sx = (Math.random() - 0.5) * shakeRef.current;
          const sy = (Math.random() - 0.5) * shakeRef.current;
          ctx.translate(sx, sy);
          shakeRef.current *= 0.9;
        }

        // Apply Zoom and Pan
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX + offset.x, centerY + offset.y);
        ctx.scale(zoom, zoom);
        ctx.translate(-centerX, -centerY);

        // Background stars
        starsRef.current.forEach(s => s.draw(ctx));
        
        const currentForces = forcesRef.current;
        
        // Update dynamic forces
        currentForces.forEach(f => {
          if (f.behavior === 'pulsate') {
            f.phase = (f.phase || 0) + (f.speed || 0.05);
            const scale = 0.7 + Math.sin(f.phase) * 0.3;
            f.radius = (f.baseRadius || f.radius) * scale;
            f.strength = (f.baseStrength || f.strength) * scale;
          } else if (f.behavior === 'wander') {
            f.x += f.vx || 0;
            f.y += f.vy || 0;
            // Wander freely without hard boundary
            const maxRadius = Math.max(canvas.width, canvas.height) * 2.5; 
            const dx = f.x - canvas.width / 2;
            const dy = f.y - canvas.height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxRadius) {
              // Respawn near center if too far
              f.x = canvas.width / 2 + (Math.random() - 0.5) * 100;
              f.y = canvas.height / 2 + (Math.random() - 0.5) * 100;
              f.vx = (Math.random() - 0.5) * 4;
              f.vy = (Math.random() - 0.5) * 4;
            }
          } else if (f.behavior === 'orbit') {
            f.phase = (f.phase || 0) + (f.speed || 0.01);
            const orbitRadius = 100;
            const centerX = f.baseX || canvas.width / 2;
            const centerY = f.baseY || canvas.height / 2;
            f.x = centerX + Math.cos(f.phase) * orbitRadius;
            f.y = centerY + Math.sin(f.phase) * orbitRadius;
          }
        });

        // Draw Charge Indicator
        if (charge > 0 && mousePos.current) {
          ctx.save();
          ctx.translate(mousePos.current.x, mousePos.current.y);
          ctx.globalCompositeOperation = 'lighter';
          
          // Outer ring
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + charge * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 40 + charge * 40, 0, Math.PI * 2);
          ctx.stroke();
          
          // Inner glow
          const innerRadius = 20 + charge * 60;
          if (Number.isFinite(innerRadius) && innerRadius > 0) {
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerRadius);
            grad.addColorStop(0, `rgba(255, 255, 255, ${charge * 0.8})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Sparks while charging
          if (charge > 0.3) {
            for (let i = 0; i < 5; i++) {
              const angle = Math.random() * Math.PI * 2;
              const r = (20 + charge * 60) * Math.random();
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(Math.cos(angle) * r, Math.sin(angle) * r, 2, 2);
            }
          }
          
          ctx.restore();
        }
        
        // Spatial partitioning for collisions
        const grid: Map<number, Particle[]> = new Map();
        const cellSize = 60;
        if (config.enableCollisions) {
          particlesRef.current.forEach(p => {
            const gx = Math.floor(p.x / cellSize);
            const gy = Math.floor(p.y / cellSize);
            const key = (gx << 16) | (gy & 0xFFFF);
            let cell = grid.get(key);
            if (!cell) {
              cell = [];
              grid.set(key, cell);
            }
            cell.push(p);
          });
        }

        // Draw Simulation Boundary
        /*
        const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;
        const boundaryGlow = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, maxRadius - 20, canvas.width / 2, canvas.height / 2, maxRadius + 20);
        boundaryGlow.addColorStop(0, 'rgba(255, 255, 255, 0)');
        boundaryGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        boundaryGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = boundaryGlow;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, maxRadius + 20, 0, Math.PI * 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, maxRadius - 20, 0, Math.PI * 2, true);
        ctx.fill();
        */

        // Draw Spawn Preview
        if (modes.includes('spawn-particle') && spawnStartPos.current && mousePos.current) {
          ctx.save();
          ctx.strokeStyle = 'rgba(0, 255, 204, 0.5)';
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(spawnStartPos.current.x, spawnStartPos.current.y);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.stroke();
          
          // Draw start point
          ctx.fillStyle = '#00ffcc';
          ctx.beginPath();
          ctx.arc(spawnStartPos.current.x, spawnStartPos.current.y, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw arrow head at release point
          const angle = Math.atan2(mousePos.current.y - spawnStartPos.current.y, mousePos.current.x - spawnStartPos.current.x);
          ctx.translate(mousePos.current.x, mousePos.current.y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-10, -5);
          ctx.lineTo(-10, 5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        particlesRef.current.forEach(p => {
          // Neural Network Mode: Draw connections
          if (modes.includes('neural-network')) {
            const gx = Math.floor(p.x / cellSize);
            const gy = Math.floor(p.y / cellSize);
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const key = ((gx + i) << 16) | ((gy + j) & 0xFFFF);
                const cell = grid.get(key);
                if (cell) {
                  cell.forEach(other => {
                    if (p === other) return;
                    const dx = other.x - p.x;
                    const dy = other.y - p.y;
                    const distSq = dx * dx + dy * dy;
                    const maxDist = 80;
                    if (distSq < maxDist * maxDist) {
                      const dist = Math.sqrt(distSq);
                      const alpha = (1 - dist / maxDist) * 0.3;
                      ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
                      ctx.lineWidth = 0.5;
                      ctx.beginPath();
                      ctx.moveTo(p.x, p.y);
                      ctx.lineTo(other.x, other.y);
                      // Remove ctx.stroke() to fulfill "ลบขีดวงกลมออก" if it refers to lines
                      // But the user said "circular lines", so maybe they mean something else.
                      // Let's keep the connections for now but make them more subtle or remove if requested.
                      // Actually, let's remove it to be safe as they said "ลบขีด" (remove lines).
                    }
                  });
                }
              }
            }
          }

          // Apply inter-particle repulsion if enabled
          if (config.enableCollisions) {
            const gx = Math.floor(p.x / cellSize);
            const gy = Math.floor(p.y / cellSize);
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const key = ((gx + i) << 16) | ((gy + j) & 0xFFFF);
                const cell = grid.get(key);
                if (cell) {
                  cell.forEach(other => {
                    if (p === other) return;
                    
                    const isDarkP = p.type === 'dark-matter';
                    const isDarkO = other.type === 'dark-matter';

                    // Dark matter interaction logic:
                    // It only collides with itself, but exerts a tiny gravitational pull on others
                    if (isDarkP || isDarkO) {
                      const dx = other.x - p.x;
                      const dy = other.y - p.y;
                      const distSq = dx * dx + dy * dy;
                      
                      if (isDarkP && isDarkO) {
                        // Two dark matter particles: collide with each other
                        const minDist = p.size + other.size;
                        if (distSq < minDist * minDist) {
                          // Standard collision logic for dark matter with itself
                          const dist = Math.sqrt(distSq) || 0.1;
                          const overlap = minDist - dist;
                          const nx = dx / dist;
                          const ny = dy / dist;
                          p.x -= nx * overlap * 0.5;
                          p.y -= ny * overlap * 0.5;
                          other.x += nx * overlap * 0.5;
                          other.y += ny * overlap * 0.5;
                          
                          const rvx = other.vx - p.vx;
                          const rvy = other.vy - p.vy;
                          const velAlongNormal = rvx * nx + rvy * ny;
                          if (velAlongNormal < 0) {
                            const j = -(1 + 0.1) * velAlongNormal / (1/p.mass + 1/other.mass);
                            p.vx -= (1/p.mass) * j * nx;
                            p.vy -= (1/p.mass) * j * ny;
                            other.vx += (1/other.mass) * j * nx;
                            other.vy += (1/other.mass) * j * ny;
                          }
                        }
                        return;
                      }

                      if (isDarkP !== isDarkO) {
                        // Subtle gravitational nudge instead of hard collision
                        const influenceRadius = (p.size + other.size) * 12;
                        if (distSq < influenceRadius * influenceRadius) {
                          const dist = Math.sqrt(distSq) || 0.1;
                          // Dark matter exerts a pull on the other particle
                          const pullStrength = 0.01;
                          if (isDarkP) {
                            // p is dark matter, other is pulled towards p
                            other.vx -= (dx / dist) * pullStrength;
                            other.vy -= (dy / dist) * pullStrength;
                          } else {
                            // other is dark matter, p is pulled towards other
                            p.vx += (dx / dist) * pullStrength;
                            p.vy += (dy / dist) * pullStrength;
                          }
                        }
                        return; 
                      }
                    }

                    const dx = other.x - p.x;
                    const dy = other.y - p.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = p.size + other.size;
                    
                    if (distSq < minDist * minDist) {
                      const dist = Math.sqrt(distSq) || 0.1;
                      const overlap = minDist - dist;
                      
                      // 1. Resolve Overlap (Static resolution)
                      const totalMass = p.mass + other.mass;
                      const pRatio = other.mass / totalMass;
                      const oRatio = p.mass / totalMass;
                      
                      p.x -= (dx / dist) * overlap * pRatio;
                      p.y -= (dy / dist) * overlap * pRatio;
                      other.x += (dx / dist) * overlap * oRatio;
                      other.y += (dy / dist) * overlap * oRatio;

                      // 2. Realistic Elastic Collision (Conservation of Momentum)
                      // Normal vector
                      const nx = dx / dist;
                      const ny = dy / dist;

                      // Relative velocity
                      const rvx = other.vx - p.vx;
                      const rvy = other.vy - p.vy;

                      // Relative velocity along normal
                      const velAlongNormal = rvx * nx + rvy * ny;

                      // Do not resolve if velocities are separating
                      if (velAlongNormal < 0) {
                        // Combined restitution
                        const e = Math.min(p.restitution, other.restitution);

                        // Impulse scalar
                        let j = -(1 + e) * velAlongNormal;
                        j /= (1 / p.mass + 1 / other.mass);

                        // Apply impulse
                        const impulseX = j * nx;
                        const impulseY = j * ny;

                        p.vx -= (1 / p.mass) * impulseX;
                        p.vy -= (1 / p.mass) * impulseY;
                        other.vx += (1 / other.mass) * impulseX;
                        other.vy += (1 / other.mass) * impulseY;
                      }
                      
                      // Energy exchange and type-specific effects
                      const energyExchange = (p.energy - other.energy) * 0.15;
                      p.energy -= energyExchange;
                      other.energy += energyExchange;

                      // Quarks and Electric particles gain energy on impact
                      if (p.type === 'quark' || p.type === 'electric') p.energy = Math.min(1, p.energy + 0.05);
                      if (other.type === 'quark' || other.type === 'electric') other.energy = Math.min(1, other.energy + 0.05);
                      
                      // Nuclear particles can trigger a small "spark"
                      if (p.type === 'nuclear' || other.type === 'nuclear') {
                        p.energy = Math.min(1, p.energy + 0.1);
                        other.energy = Math.min(1, other.energy + 0.1);
                      }

                      // Trigger visual collision effects
                      if (Math.random() < 0.2) {
                        let effectType: CollisionEffectType = 'transfer';
                        let effectColor = `hsla(${p.hue}, 100%, 70%, 1)`;
                        
                        const isHighEnergy = p.energy > 0.7 || other.energy > 0.7;
                        const isHeavyCollision = p.mass > 15 || other.mass > 15;

                        if (p.type === 'electric' || other.type === 'electric') {
                          effectType = 'sparks';
                          effectColor = '#00ffff';
                        } else if (p.type === 'nuclear' || other.type === 'nuclear') {
                          effectType = 'explosion';
                          effectColor = '#ff3300';
                          if (isHighEnergy) shakeRef.current = Math.max(shakeRef.current, 5);
                        } else if (p.type === 'universal' || other.type === 'universal') {
                          effectType = 'burst';
                          effectColor = '#ff00ff';
                          if (isHighEnergy) shakeRef.current = Math.max(shakeRef.current, 10);
                        } else if (isHeavyCollision && isHighEnergy) {
                          effectType = 'shockwave';
                          effectColor = '#ffffff';
                          shakeRef.current = Math.max(shakeRef.current, 8);
                        } else if (isHighEnergy) {
                          effectType = 'fragment';
                        }
                        
                        collisionEffectsRef.current.push(new CollisionEffect(
                          (p.x + other.x) / 2,
                          (p.y + other.y) / 2,
                          effectType,
                          effectColor,
                          config.highDefinition
                        ));

                        // Particle Fragmentation Logic
                        if (isHighEnergy && isHeavyCollision && Math.random() < 0.3) {
                          const fragmentCount = Math.floor(Math.random() * 3) + 2;
                          const centerX = (p.x + other.x) / 2;
                          const centerY = (p.y + other.y) / 2;
                          
                          for (let i = 0; i < fragmentCount; i++) {
                            const frag = new Particle(canvas.width, canvas.height, Math.random() > 0.5 ? 'quark' : 'energy');
                            frag.x = centerX;
                            frag.y = centerY;
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 2 + Math.random() * 5;
                            frag.vx = Math.cos(angle) * speed;
                            frag.vy = Math.sin(angle) * speed;
                            frag.energy = 0.8;
                            particlesRef.current.push(frag);
                          }
                          
                          // Reduce mass of colliding particles if they fragmented
                          p.mass *= 0.8;
                          other.mass *= 0.8;
                          p.baseSize *= 0.9;
                          other.baseSize *= 0.9;
                        }

                        // Cap effects for performance
                        if (collisionEffectsRef.current.length > (isMobile ? 20 : 60)) {
                          collisionEffectsRef.current.shift();
                        }
                        
                        // Cap particles for performance
                        if (particlesRef.current.length > config.particleCount * 1.5) {
                          particlesRef.current.shift();
                        }
                      }

                      // Matter Transformation Logic
                      // If high energy collision, matter can transform into energy types
                      if (p.energy > 0.8 && other.energy > 0.8) {
                        if (p.type === 'matter' || p.type === 'heavy-atom') {
                          p.type = Math.random() > 0.5 ? 'energy' : 'electric';
                          p.initTypeProps();
                        }
                        if (other.type === 'matter' || other.type === 'heavy-atom') {
                          other.type = Math.random() > 0.5 ? 'energy' : 'electric';
                          other.initTypeProps();
                        }
                      }
                    }
                  });
                }
              }
            }
          }

          p.update(canvas.width, canvas.height, currentForces, config, modes, collisionEffectsRef.current);

          // Quantum Collision Logic
          if (modes.includes('quantum') && config.enableCollisions) {
            const gx = Math.floor(p.x / cellSize);
            const gy = Math.floor(p.y / cellSize);
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const key = ((gx + i) << 16) | ((gy + j) & 0xFFFF);
                const cell = grid.get(key);
                if (cell) {
                  cell.forEach(other => {
                    if (p === other) return;
                    const dx = other.x - p.x;
                    const dy = other.y - p.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = p.size + other.size;
                    
                    if (distSq < minDist * minDist) {
                      const rand = Math.random();
                      
                      // 1. Entanglement (Spooky action at a distance)
                      if (rand < 0.08) {
                        p.quantumState.entangledWith = other.id;
                        other.quantumState.entangledWith = p.id;
                        p.quantumState.coherence = Math.min(1, p.quantumState.coherence + 0.2);
                        other.quantumState.coherence = Math.min(1, other.quantumState.coherence + 0.2);
                        collisionEffectsRef.current.push(new CollisionEffect((p.x + other.x)/2, (p.y + other.y)/2, 'entanglement', '#ff00ff', config.highDefinition));
                      }
                      
                      // 2. Excitation (Energy level jump)
                      else if (rand < 0.15) {
                        if (p.quantumState.energyLevel < 5) {
                          p.quantumState.energyLevel++;
                          collisionEffectsRef.current.push(new CollisionEffect(p.x, p.y, 'excitation', p.color, config.highDefinition));
                        }
                      }
                      
                      // 3. Emission (Photon release)
                      else if (rand < 0.22 && p.quantumState.energyLevel > 0) {
                        p.quantumState.energyLevel--;
                        collisionEffectsRef.current.push(new CollisionEffect(p.x, p.y, 'emission', p.color, config.highDefinition));
                        // Spawn a photon
                        const photon = new Particle(canvas.width, canvas.height, 'photon');
                        photon.x = p.x;
                        photon.y = p.y;
                        const angle = Math.random() * Math.PI * 2;
                        photon.vx = Math.cos(angle) * 8;
                        photon.vy = Math.sin(angle) * 8;
                        particlesRef.current.push(photon);
                      }
                      
                      // 4. Absorption
                      else if (rand < 0.28 && other.type === 'photon') {
                        p.quantumState.energyLevel = Math.min(5, p.quantumState.energyLevel + 1);
                        other.life = 0; // Photon absorbed
                        collisionEffectsRef.current.push(new CollisionEffect(p.x, p.y, 'absorption', p.color, config.highDefinition));
                      }
                      
                      // 5. Quantum Tunneling (Passing through)
                      else if (rand < 0.35 && (p.quantumState.coherence > 0.5 || other.quantumState.coherence > 0.5)) {
                        // Swap positions or just ignore collision
                        const tempX = p.x;
                        const tempY = p.y;
                        p.x = other.x;
                        p.y = other.y;
                        other.x = tempX;
                        other.y = tempY;
                        collisionEffectsRef.current.push(new CollisionEffect(p.x, p.y, 'tunneling', '#00ffff', config.highDefinition));
                      }
                      
                      // 6. Decoherence (State collapse)
                      else if (rand < 0.42) {
                        p.quantumState.coherence *= 0.4;
                        other.quantumState.coherence *= 0.4;
                        if (p.quantumState.coherence < 0.1) p.quantumState.isCollapsed = true;
                        collisionEffectsRef.current.push(new CollisionEffect((p.x + other.x)/2, (p.y + other.y)/2, 'decoherence', '#ffffff', config.highDefinition));
                      }
                      
                      // 7. State Transition (Quantum Jump)
                      else if (rand < 0.45) {
                        p.type = p.getRandomType();
                        p.initTypeProps();
                        collisionEffectsRef.current.push(new CollisionEffect(p.x, p.y, 'transition', p.color, config.highDefinition));
                      }
                    }
                  });
                }
              }
            }
          }

          p.draw(ctx, config, modes, quantumSettings);
          
          // Draw Entanglement Lines
          if (modes.includes('quantum') && quantumSettings.showEntanglement && p.quantumState.entangledWith) {
            const other = particlesRef.current.find(op => op.id === p.quantumState.entangledWith);
            if (other) {
              ctx.save();
              ctx.strokeStyle = '#ff00ff';
              ctx.globalAlpha = 0.2 * p.quantumState.coherence;
              ctx.setLineDash([2, 4]);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });

        // Update and draw collision effects
        collisionEffectsRef.current = collisionEffectsRef.current.filter(effect => {
          const alive = effect.update();
          if (alive) effect.draw(ctx);
          return alive;
        });

        // Draw forces
        ctx.globalCompositeOperation = 'lighter';
        currentForces.forEach(f => {
          const age = Date.now() - f.createdAt;
          const life = Math.max(0, 1 - age / f.duration);
          
          ctx.save();
          ctx.translate(f.x, f.y);
          
          const color = f.color || '#ffffff';
          const radius = f.radius * life;

          // Unique visual styles based on ForceType
          switch (f.type) {
            case 'sound-wave':
              // Concentric expanding rings for sound waves
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              for (let i = 0; i < 3; i++) {
                const r = ((age * 0.2 + i * radius / 3) % radius);
                const alpha = life * (1 - r / radius);
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.stroke();
              }
              break;
            case 'electric':
              // Subtle glow instead of lightning lines
              if (Number.isFinite(radius) && radius > 0) {
                const eGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                eGrad.addColorStop(0, color + '44');
                eGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = eGrad;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fill();
              }
              break;
            case 'nuclear':
              // Pulsing core
              if (Number.isFinite(radius) && radius > 0) {
                const nGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                nGrad.addColorStop(0, color);
                nGrad.addColorStop(0.2, color + 'aa');
                nGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = nGrad;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fill();
              }
              // Inner core
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = 0.3 * life;
              ctx.beginPath();
              ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'vortex':
              // Spiraling lines
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                const startAngle = (i / 4) * Math.PI * 2 + Date.now() * 0.005;
                for (let a = 0; a < Math.PI * 2; a += 0.2) {
                  const r = (a / (Math.PI * 2)) * radius;
                  const x = Math.cos(startAngle + a) * r;
                  const y = Math.sin(startAngle + a) * r;
                  if (a === 0) ctx.moveTo(x, y);
                  else ctx.lineTo(x, y);
                }
                ctx.stroke();
              }
              break;
            case 'black-hole':
              // Dark core with event horizon glow
              ctx.globalCompositeOperation = 'source-over';
              ctx.fillStyle = '#000000';
              ctx.beginPath();
              ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.globalCompositeOperation = 'lighter';
              const bhGrad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
              bhGrad.addColorStop(0, '#ff00ff');
              bhGrad.addColorStop(0.5, '#4400aa');
              bhGrad.addColorStop(1, 'transparent');
              ctx.fillStyle = bhGrad;
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'cosmic':
              // Star sparkles
              for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * radius;
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = life * Math.random();
                ctx.fillRect(Math.cos(angle) * r, Math.sin(angle) * r, 2, 2);
              }
              if (Number.isFinite(radius) && radius > 0) {
                const cGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                cGrad.addColorStop(0, color + '44');
                cGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = cGrad;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fill();
              }
              break;
            default:
              if (Number.isFinite(radius) && radius > 0) {
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'transparent');
                ctx.globalAlpha = life * 0.6;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fill();
              }
          }
          
          ctx.globalAlpha = 1;
          ctx.restore();

          // Visual Indicator on hover/proximity
          if (mousePos.current) {
            const dx = f.x - mousePos.current.x;
            const dy = f.y - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < f.radius + 50) {
              const energyConfig = ENERGY_TYPES.find(e => e.id === f.type);
              const remaining = Math.max(0, f.duration - age);
              
              ctx.save();
              
              // Draw info box
              const behaviorLabel = f.behavior === 'pulsate' ? 'สั่นสะเทือน' : (f.behavior === 'wander' ? 'พเนจร' : (f.behavior === 'orbit' ? 'โคจร' : 'คงที่'));
              const label = `${energyConfig?.label || f.type} (${behaviorLabel})`;
              const timeLabel = `${(remaining / 1000).toFixed(1)}s`;
              const radiusLabel = `${Math.round(f.radius)}px`;
              
              ctx.font = 'bold 12px Outfit';
              const textWidth = Math.max(
                ctx.measureText(label).width,
                ctx.measureText(timeLabel).width,
                ctx.measureText(radiusLabel).width
              );
              
              const boxW = textWidth + 20;
              const boxH = 50;
              const boxX = f.x + 10;
              const boxY = f.y - f.radius - boxH - 10;
              
              // Draw background
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.roundRect(boxX, boxY, boxW, boxH, 8);
              ctx.fill();
              
              // Draw text
              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'left';
              ctx.fillText(label, boxX + 10, boxY + 18);
              ctx.font = '10px Outfit';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.fillText(`เวลา: ${timeLabel}`, boxX + 10, boxY + 32);
              ctx.fillText(`รัศมี: ${radiusLabel}`, boxX + 10, boxY + 44);
              
              ctx.restore();
            }
          }
        });

        ctx.restore(); // Restore Zoom transform
        ctx.globalCompositeOperation = 'source-over';
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, [initParticles, isPaused, modes, config, offset, zoom]);

  const handleInteraction = (x: number, y: number, isLong: boolean, isMove: boolean, chargeVal: number = 0, isRelease: boolean = false) => {
    if (activeEnergies.length === 0) return;

    // Haptic Feedback
    if (navigator.vibrate) {
      if (isRelease && chargeVal > 0.3) navigator.vibrate(50);
      else if (chargeVal > 0.8) navigator.vibrate(10);
    }

    // Adjust coordinates for zoom and pan
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const adjX = (x - centerX - offset.x) / zoom + centerX;
    const adjY = (y - centerY - offset.y) / zoom + centerY;

    if (isRelease && chargeVal > 0.3) {
      // Release explosion
      shakeRef.current = Math.max(shakeRef.current, chargeVal * 40);
      
      const isMatter = activeEnergies.includes('matter');
      const effectColor = isMatter ? '#3399ff' : '#ffffff';
      
      collisionEffectsRef.current.push(new CollisionEffect(adjX, adjY, 'explosion', effectColor, config.highDefinition));
      collisionEffectsRef.current.push(new CollisionEffect(adjX, adjY, 'shockwave', effectColor, config.highDefinition));
      
      // Create temporary Black Hole for 10 seconds as requested
      const strength = (200 + chargeVal * 800) * config.forceStrengthMult;
      const radius = (250 + chargeVal * 500) * config.forceRadiusMult;
      const forceDuration = 10000; // 10 seconds
      
      const type = 'black-hole';

      socketRef.current?.emit('addForce', {
        x: adjX,
        y: adjY,
        type: type,
        strength: strength,
        radius: radius,
        duration: forceDuration,
        color: '#000000',
        behavior: 'pulsate'
      });

      if (isMatter) {
        // Matter specific explosion: spawn fragments
        for (let i = 0; i < 15; i++) {
          const p = new Particle(canvas.width, canvas.height, 'matter');
          p.x = adjX;
          p.y = adjY;
          const angle = Math.random() * Math.PI * 2;
          const speed = 5 + Math.random() * 15 * chargeVal;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.energy = 1.0;
          particlesRef.current.push(p);
        }
      }
    }

    activeEnergies.forEach((energyType, index) => {
      let strength = 80;
      let radius = 300;
      let duration = 2000;

      if (isMove) {
        strength = 40;
        radius = 200;
        duration = 500;
      } else if (isLong || chargeVal > 0.1) {
        strength = 180 + chargeVal * 400;
        radius = 450 + chargeVal * 600;
        duration = 4000 + chargeVal * 4000;
        
        if (chargeVal > 0.5) {
          shakeRef.current = Math.max(shakeRef.current, chargeVal * 20);
          collisionEffectsRef.current.push(new CollisionEffect(adjX, adjY, 'shockwave', '#ffffff', config.highDefinition));
        }
      }

      // Slightly offset multiple energies
      const offsetX = activeEnergies.length > 1 ? (Math.random() - 0.5) * 40 : 0;
      const offsetY = activeEnergies.length > 1 ? (Math.random() - 0.5) * 40 : 0;

      const energyConfig = ENERGY_TYPES.find(e => e.id === energyType);

      const phase = Math.random() * Math.PI * 2;
      const speed = selectedBehavior === 'pulsate' ? 0.05 + Math.random() * 0.1 : (selectedBehavior === 'orbit' ? 0.01 + Math.random() * 0.02 : 0.02 + Math.random() * 0.05);
      const vx = (Math.random() - 0.5) * 4;
      const vy = (Math.random() - 0.5) * 4;

      socketRef.current?.emit('addForce', {
        x: adjX + offsetX,
        y: adjY + offsetY,
        type: energyType,
        strength: strength * config.forceStrengthMult,
        radius: radius * config.forceRadiusMult,
        duration: duration,
        color: energyConfig?.color,
        behavior: selectedBehavior,
        phase,
        speed,
        baseRadius: radius * config.forceRadiusMult,
        baseStrength: strength * config.forceStrengthMult,
        baseX: adjX + offsetX,
        baseY: adjY + offsetY,
        vx,
        vy
      });
    });

    socketRef.current?.emit('move', { x: adjX, y: adjY });

    // Energy transformation on touch/interaction
    if (!isMove && activeEnergies.length > 0) {
      particlesRef.current.forEach(p => {
        const dx = p.x - adjX;
        const dy = p.y - adjY;
        const distSq = dx * dx + dy * dy;
        const interactionRadius = 120 * config.forceRadiusMult;
        
        if (distSq < interactionRadius * interactionRadius) {
          // Transform particle type based on active energy with some probability
          if (Math.random() < 0.15) {
            const particleTypeMap: Record<string, ParticleType> = {
              'electric': 'electric',
              'nuclear': 'nuclear',
              'atomic': 'energy',
              'matter': 'matter',
              'cosmic': 'cosmic',
              'universal': 'universal',
              'light-atom': 'light-atom',
              'heavy-atom': 'heavy-atom',
              'neutral': 'neutral',
              'dark-matter': 'dark-matter',
              'quark': 'quark'
            };
            
            const newType = particleTypeMap[activeEnergies[0]];
            if (newType && p.type !== newType) {
              p.type = newType;
              p.initTypeProps();
              p.energy = Math.min(1, p.energy + 0.3);
              
              collisionEffectsRef.current.push(new CollisionEffect(
                p.x, 
                p.y, 
                'transition', 
                p.color, 
                config.highDefinition
              ));
            }
          }
        }
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle simulation if touching the canvas directly or its container background
    const target = e.target as HTMLElement;
    if (target.tagName !== 'CANVAS' && !target.classList.contains('interaction-layer')) return;

    e.preventDefault();
    touchStartTime.current = Date.now();
    isLongPress.current = false;
    
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      lastTouchDist.current = null;
      lastInteractionPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      
      // Adjust coordinates for zoom and pan
      const canvas = canvasRef.current;
      if (canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const adjX = (e.touches[0].clientX - centerX - offset.x) / zoom + centerX;
        const adjY = (e.touches[0].clientY - centerY - offset.y) / zoom + centerY;
        mousePos.current = { x: adjX, y: adjY };
        
        if (modes.includes('spawn-particle')) {
          spawnStartPos.current = { x: adjX, y: adjY };
        }
      } else {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }

      if (!modes.includes('pan') && !modes.includes('zoom') && !modes.includes('spawn-particle')) {
        // Start charging
        setCharge(0);
        if (chargeInterval.current) clearInterval(chargeInterval.current);
        chargeInterval.current = window.setInterval(() => {
          setCharge(prev => Math.min(1, prev + 0.02));
        }, 30);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'CANVAS' && !target.classList.contains('interaction-layer')) return;
    
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (lastTouchDist.current !== null) {
        const delta = dist / lastTouchDist.current;
        setZoom(prev => {
          const newZoom = prev * delta;
          return Math.min(5, Math.max(0.1, newZoom));
        });
      }
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (modes.includes('pan')) {
        if (lastInteractionPos.current) {
          const dx = touch.clientX - lastInteractionPos.current.x;
          const dy = touch.clientY - lastInteractionPos.current.y;
          setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        }
      } else if (modes.includes('zoom')) {
        if (lastInteractionPos.current) {
          const dy = touch.clientY - lastInteractionPos.current.y;
          setZoom(prev => Math.min(5, Math.max(0.1, prev - dy * 0.01)));
        }
      } else if (modes.includes('spawn-particle')) {
        // Adjust coordinates for zoom and pan
        const canvas = canvasRef.current;
        if (canvas) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const adjX = (touch.clientX - centerX - offset.x) / zoom + centerX;
          const adjY = (touch.clientY - centerY - offset.y) / zoom + centerY;
          mousePos.current = { x: adjX, y: adjY };
        }
      } else {
        mousePos.current = { x: touch.clientX, y: touch.clientY };
        handleInteraction(touch.clientX, touch.clientY, false, true);
      }
      lastInteractionPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'CANVAS' && !target.classList.contains('interaction-layer')) return;

    if (e.touches.length < 2) {
      lastTouchDist.current = null;
    }
    
    if (e.touches.length === 0) {
      if (chargeInterval.current) {
        clearInterval(chargeInterval.current);
        chargeInterval.current = null;
      }
      
      const duration = Date.now() - touchStartTime.current;
      const currentCharge = charge;
      setCharge(0);

      // Swipe detection
      if (e.changedTouches.length === 1 && touchStartPos.current) {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartPos.current.x;
        const dy = touch.clientY - touchStartPos.current.y;

        // Horizontal swipe: dx > 80px, dy < 60px, duration < 300ms
        if (Math.abs(dx) > 80 && Math.abs(dy) < 60 && duration < 300) {
          cycleMode(dx > 0 ? 'prev' : 'next');
          // Reset refs to prevent other actions
          spawnStartPos.current = null;
          touchStartPos.current = null;
          lastInteractionPos.current = null;
          return;
        }
      }

      if (modes.includes('spawn-particle') && spawnStartPos.current) {
        const touch = e.changedTouches[0];
        const canvas = canvasRef.current;
        if (canvas) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const adjX = (touch.clientX - centerX - offset.x) / zoom + centerX;
          const adjY = (touch.clientY - centerY - offset.y) / zoom + centerY;
          
          const particleTypeMap: Record<string, ParticleType> = {
            'electric': 'electric',
            'nuclear': 'nuclear',
            'atomic': 'energy',
            'matter': 'matter',
            'cosmic': 'cosmic',
            'universal': 'universal',
            'light-atom': 'light-atom',
            'heavy-atom': 'heavy-atom',
            'neutral': 'neutral',
            'dark-matter': 'dark-matter',
            'quark': 'quark',
            'antimatter': 'antimatter',
            'plasma': 'plasma',
            'photon': 'photon'
          };
          
          const selectedType = activeEnergies.length > 0 ? particleTypeMap[activeEnergies[0]] : 'energy';
          const newParticle = new Particle(canvas.width, canvas.height, selectedType || 'energy');
          
          newParticle.x = spawnStartPos.current.x;
          newParticle.y = spawnStartPos.current.y;
          
          newParticle.vx = (adjX - spawnStartPos.current.x) * 0.1;
          newParticle.vy = (adjY - spawnStartPos.current.y) * 0.1;
          newParticle.energy = 0.8;
          
          particlesRef.current.push(newParticle);
          
          collisionEffectsRef.current.push(new CollisionEffect(
            newParticle.x,
            newParticle.y,
            'burst',
            newParticle.color,
            config.highDefinition
          ));
        }
      } else if (!modes.includes('pan') && !modes.includes('zoom')) {
        const touch = e.changedTouches[0];
        handleInteraction(touch.clientX, touch.clientY, duration > 500, false, currentCharge, true);
      }
      mousePos.current = null;
      spawnStartPos.current = null;
      touchStartPos.current = null;
      lastInteractionPos.current = null;
    } else {
      mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastInteractionPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const changeAllParticles = (type: ParticleType) => {
    particlesRef.current.forEach(p => {
      p.type = type;
      p.initTypeProps();
    });
  };

  const cycleMode = useCallback((direction: 'next' | 'prev') => {
    const allModeIds = MODES.map(m => m.id);
    const currentPrimary = modes[0];
    let currentIndex = allModeIds.indexOf(currentPrimary);
    if (currentIndex === -1) currentIndex = 0;
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % allModeIds.length;
    } else {
      nextIndex = (currentIndex - 1 + allModeIds.length) % allModeIds.length;
    }
    
    const nextModeId = allModeIds[nextIndex];
    setModes([nextModeId]);
    shakeRef.current = 5; // Subtle feedback
  }, [modes]);

  const toggleEnergy = (type: ForceType) => {
    setActiveEnergies(prev => 
      prev.includes(type) 
      ? prev.filter(t => t !== type) 
      : [...prev, type]
    );
    
    // Also change all particles to this type if it's a particle type
    const particleTypeMap: Record<string, ParticleType> = {
      'fire': 'fire',
      'water': 'water',
      'wind': 'wind',
      'earth': 'earth',
      'light': 'light',
      'darkness': 'darkness',
      'lightning': 'lightning',
      'ice': 'ice',
      'thermal': 'thermal',
      'magnetic': 'magnetic',
      'electric': 'electric',
      'sound-wave': 'sound-wave',
      'pressure': 'pressure',
      'plasma': 'plasma',
      'gravity': 'gravity',
      'shockwave': 'shockwave',
      'photon': 'photon',
      'electron': 'electron',
      'proton': 'proton',
      'neutron': 'neutron',
      'ion': 'ion',
      'neutrino': 'neutrino',
      'quark': 'quark',
      'boson': 'boson',
      'stellar': 'stellar',
      'solar': 'solar',
      'lunar': 'lunar',
      'cosmic-ray': 'cosmic-ray',
      'nebula': 'nebula',
      'black-hole': 'black-hole',
      'supernova': 'supernova',
      'dark-matter': 'dark-matter',
      'liquid-metal': 'liquid-metal',
      'crystal': 'crystal',
      'toxic-gas': 'toxic-gas',
      'radiation': 'radiation',
      'quantum-matter': 'quantum-matter',
      'bio-energy': 'bio-energy',
      'psionic': 'psionic',
      'mutating-matter': 'mutating-matter'
    };
    
    if (particleTypeMap[type]) {
      changeAllParticles(particleTypeMap[type]);
    }
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setActiveEnergies(p.energies as ForceType[]);
    setModes([p.mode]);
  };

  const resetSimulation = () => {
    initParticles();
    setForces([]);
    forcesRef.current = [];
    setZoom(1.0);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative w-full h-screen select-none outline-none overflow-hidden bg-[#05050a] touch-none interaction-layer"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'CANVAS' && !target.classList.contains('interaction-layer')) return;

        isMouseDown.current = true;
        mouseDownTime.current = Date.now();
        lastInteractionPos.current = { x: e.clientX, y: e.clientY };
        mousePos.current = { x: e.clientX, y: e.clientY };
        
        if (modes.includes('spawn-particle')) {
          // Adjust coordinates for zoom and pan
          const canvas = canvasRef.current;
          if (canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const adjX = (e.clientX - centerX - offset.x) / zoom + centerX;
            const adjY = (e.clientY - centerY - offset.y) / zoom + centerY;
            spawnStartPos.current = { x: adjX, y: adjY };
          }
        } else if (!modes.includes('pan') && !modes.includes('zoom')) {
          // Start charging
          setCharge(0);
          if (chargeInterval.current) clearInterval(chargeInterval.current);
          chargeInterval.current = window.setInterval(() => {
            setCharge(prev => Math.min(1, prev + 0.02));
          }, 30);
        }
      }}
      onMouseMove={(e) => {
        // Adjust mouse position for zoom and pan for the preview
        const canvas = canvasRef.current;
        if (canvas) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const adjX = (e.clientX - centerX - offset.x) / zoom + centerX;
          const adjY = (e.clientY - centerY - offset.y) / zoom + centerY;
          mousePos.current = { x: adjX, y: adjY };
        } else {
          mousePos.current = { x: e.clientX, y: e.clientY };
        }

        if (isMouseDown.current) {
          const target = e.target as HTMLElement;
          if (target.tagName !== 'CANVAS' && !target.classList.contains('interaction-layer')) return;

          if (modes.includes('pan')) {
            if (lastInteractionPos.current) {
              const dx = e.clientX - lastInteractionPos.current.x;
              const dy = e.clientY - lastInteractionPos.current.y;
              setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            }
          } else if (modes.includes('zoom')) {
            if (lastInteractionPos.current) {
              const dy = e.clientY - lastInteractionPos.current.y;
              setZoom(prev => Math.min(5, Math.max(0.1, prev - dy * 0.01)));
            }
          } else if (modes.includes('spawn-particle')) {
            // Do nothing, just update mousePos for preview
          } else {
            handleInteraction(e.clientX, e.clientY, false, true);
          }
        }
        lastInteractionPos.current = { x: e.clientX, y: e.clientY };
      }}
      onMouseUp={(e) => {
        if (isMouseDown.current) {
          if (chargeInterval.current) {
            clearInterval(chargeInterval.current);
            chargeInterval.current = null;
          }
          
          const duration = Date.now() - mouseDownTime.current;
          const currentCharge = charge;
          setCharge(0);

          if (modes.includes('spawn-particle') && spawnStartPos.current) {
            const canvas = canvasRef.current;
            if (canvas) {
              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;
              const adjX = (e.clientX - centerX - offset.x) / zoom + centerX;
              const adjY = (e.clientY - centerY - offset.y) / zoom + centerY;
              
              // Determine particle type from active energies
              const particleTypeMap: Record<string, ParticleType> = {
                'fire': 'fire',
                'water': 'water',
                'wind': 'wind',
                'earth': 'earth',
                'light': 'light',
                'darkness': 'darkness',
                'lightning': 'lightning',
                'ice': 'ice',
                'thermal': 'thermal',
                'magnetic': 'magnetic',
                'electric': 'electric',
                'sound-wave': 'sound-wave',
                'pressure': 'pressure',
                'plasma': 'plasma',
                'gravity': 'gravity',
                'shockwave': 'shockwave',
                'photon': 'photon',
                'electron': 'electron',
                'proton': 'proton',
                'neutron': 'neutron',
                'ion': 'ion',
                'neutrino': 'neutrino',
                'quark': 'quark',
                'boson': 'boson',
                'stellar': 'stellar',
                'solar': 'solar',
                'lunar': 'lunar',
                'cosmic-ray': 'cosmic-ray',
                'nebula': 'nebula',
                'black-hole': 'black-hole',
                'supernova': 'supernova',
                'dark-matter': 'dark-matter',
                'liquid-metal': 'liquid-metal',
                'crystal': 'crystal',
                'toxic-gas': 'toxic-gas',
                'radiation': 'radiation',
                'quantum-matter': 'quantum-matter',
                'bio-energy': 'bio-energy',
                'psionic': 'psionic',
                'mutating-matter': 'mutating-matter'
              };
              
              const selectedType = activeEnergies.length > 0 ? particleTypeMap[activeEnergies[0]] : 'energy';
              const newParticle = new Particle(canvas.width, canvas.height, selectedType || 'energy');
              
              newParticle.x = spawnStartPos.current.x;
              newParticle.y = spawnStartPos.current.y;
              
              // Velocity based on drag vector
              newParticle.vx = (adjX - spawnStartPos.current.x) * 0.1;
              newParticle.vy = (adjY - spawnStartPos.current.y) * 0.1;
              newParticle.energy = 0.8;
              
              particlesRef.current.push(newParticle);
              
              // Visual effect at spawn
              collisionEffectsRef.current.push(new CollisionEffect(
                newParticle.x,
                newParticle.y,
                'burst',
                newParticle.color,
                config.highDefinition
              ));
            }
          } else if (!modes.includes('pan') && !modes.includes('zoom')) {
            handleInteraction(e.clientX, e.clientY, duration > 500, false, currentCharge, true);
          }
        }
        isMouseDown.current = false;
        spawnStartPos.current = null;
        lastInteractionPos.current = null;
      }}
      onMouseLeave={() => {
        mousePos.current = null;
        isMouseDown.current = false;
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Charge Bar */}
      <AnimatePresence>
        {charge > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64 h-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 overflow-hidden z-50 pointer-events-none"
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${charge * 100}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            />
            {charge > 0.8 && (
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute inset-0 bg-white/30"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile UI Overlay */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <AnimatePresence>
            {isTopMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto"
              >
                <h1 className="text-xl font-black italic cosmic-title glow-text leading-none">COSMIC FLOW</h1>
                <p className="text-[8px] uppercase tracking-[0.4em] text-white/40 mt-1">ห้องทดลองพลังงานและสสาร</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={toggleQuantumWorld}
              className={`flex items-center gap-2 px-4 h-10 rounded-full border transition-all ${
                isQuantumWorld 
                  ? 'bg-white/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'bg-white/5 backdrop-blur-md border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <Atom size={18} className={isQuantumWorld ? 'animate-spin-slow' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Quantum World</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); setIsTopMenuOpen(!isTopMenuOpen); }}
              className={`w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:bg-white/10`}
              title={isTopMenuOpen ? "ซ่อนเมนูบน" : "แสดงเมนูบน"}
            >
              <Layers size={18} className={isTopMenuOpen ? "text-cyan-400" : "text-white/40"} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center text-white transition-all duration-300 shadow-lg ${isPaused ? 'bg-white/10 border-white/20 shadow-white/5' : 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10'}`}
            >
              {isPaused ? <Play size={18} className="fill-current" /> : <Pause size={18} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); resetSimulation(); }}
              className="px-4 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2 text-white hover:bg-white/10 active:scale-95 transition-all duration-300 shadow-lg"
              title="รีเซ็ตระบบ"
            >
              <RefreshCcw size={18} />
              <span className="text-[10px] font-bold hidden sm:inline">รีเซ็ตระบบ</span>
            </button>
            <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden items-center shadow-lg">
              <div className="px-3 text-[10px] font-bold text-white/40 border-r border-white/10 h-full flex items-center bg-white/5">
                {Math.round(zoom * 100)}%
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setZoom(0.5); }}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:bg-white/10 active:bg-white/20 transition-colors"
                title="มุมมองกว้าง"
              >
                <Search size={16} className="opacity-60" />
              </button>
              <div className="w-[1px] h-6 bg-white/10 self-center" />
              <button 
                onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.min(5, prev + 0.1)); }}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:bg-white/10 active:bg-white/20 transition-colors"
                title="ซูมเข้า"
              >
                <ZoomIn size={18} />
              </button>
              <div className="w-[1px] h-6 bg-white/10 self-center" />
              <button 
                onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.max(0.1, prev - 0.1)); }}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:bg-white/10 active:bg-white/20 transition-colors"
                title="ซูมออก"
              >
                <ZoomOut size={18} />
              </button>
              <div className="w-[1px] h-6 bg-white/10 self-center" />
              <button 
                onClick={(e) => { e.stopPropagation(); setZoom(1.0); setOffset({ x: 0, y: 0 }); }}
                className="px-4 h-10 flex items-center justify-center text-white/60 hover:bg-white/10 active:bg-white/20 transition-colors text-[10px] font-bold"
                title="รีเซ็ตมุมมอง"
              >
                1x
              </button>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-90 pointer-events-auto ${
                showSettings ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 backdrop-blur-md border border-white/10 text-white/60'
              }`}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col gap-4 pointer-events-auto">
          <div className="flex justify-end mb-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsBottomMenuOpen(!isBottomMenuOpen); }}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-xl hover:bg-white/10"
              title={isBottomMenuOpen ? "ซ่อนเมนูล่าง" : "แสดงเมนูล่าง"}
            >
              <Activity size={18} className={isBottomMenuOpen ? "text-cyan-400" : "text-white/40"} />
            </button>
          </div>

          <AnimatePresence>
            {isBottomMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="flex flex-col gap-4"
              >
                {/* Behavior Selector */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 ml-2">พฤติกรรมสนามพลัง</span>
                  <div className="flex gap-2">
                    {BEHAVIORS.map((b) => (
                      <button
                        key={b.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedBehavior(b.id); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all active:scale-95 pointer-events-auto relative overflow-hidden backdrop-blur-xl ${
                          selectedBehavior === b.id 
                          ? 'bg-white/10 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {selectedBehavior === b.id && (
                          <motion.div 
                            layoutId="behavior-active-glow"
                            className="absolute inset-0 bg-white/5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                        <span className="relative z-10">{b.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest relative z-10">{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Category Selector */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 ml-2">หมวดพลังงาน</span>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {ENERGY_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat.id); }}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 ${
                          selectedCategory === cat.id 
                          ? 'bg-white/10 border-white/40 text-white shadow-lg' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {cat.icon}
                        <span className="text-[9px] font-bold uppercase tracking-widest">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Selector */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                  <div className="flex justify-between items-end px-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">ชนิดพลังงาน</span>
                    {activeEnergies.length > 0 && (
                      <div className="flex -space-x-2">
                        {activeEnergies.map((id, idx) => {
                          const energy = ENERGY_TYPES.find(e => e.id === id);
                          return (
                            <motion.div 
                              initial={{ scale: 0, x: 20 }}
                              animate={{ scale: 1, x: 0 }}
                              key={id} 
                              className="w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg"
                              style={{ zIndex: activeEnergies.length - idx, color: energy?.color }}
                            >
                              {energy?.icon && React.cloneElement(energy.icon as React.ReactElement, { size: 10 })}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                    {ENERGY_TYPES.filter(e => e.category === selectedCategory).map((e) => {
                      const isActive = activeEnergies.includes(e.id);
                      return (
                        <button
                          key={e.id}
                          onClick={(e_obj) => { e_obj.stopPropagation(); toggleEnergy(e.id); if (navigator.vibrate) navigator.vibrate(5); }}
                          onMouseEnter={() => setHoveredEnergy(e.id)}
                          onMouseLeave={() => setHoveredEnergy(null)}
                          onTouchStart={() => setHoveredEnergy(e.id)}
                          onTouchEnd={() => setTimeout(() => setHoveredEnergy(null), 1500)}
                          className={`flex-shrink-0 snap-start flex flex-col items-center justify-center gap-1 p-2 min-w-[76px] min-h-[68px] rounded-2xl border transition-all duration-300 active:scale-90 pointer-events-auto relative overflow-hidden group backdrop-blur-xl ${
                            isActive 
                            ? 'bg-white/10 border-white/40 text-white shadow-[0_0_25px_rgba(255,255,255,0.1)]' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="energy-active-glow"
                              className="absolute inset-0 opacity-20 blur-xl"
                              style={{ backgroundColor: e.color }}
                            />
                          )}
                          <div 
                            className={`transition-all duration-300 ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}
                            style={{ 
                              color: isActive ? e.color : 'inherit',
                              filter: isActive ? `drop-shadow(0 0 5px ${e.color})` : 'none'
                            }}
                          >
                            {e.icon}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-white' : 'text-white/40'}`}>
                            {e.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Energy Tooltip / Info */}
                  <AnimatePresence mode="wait">
                    {hoveredEnergy && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="mx-2 p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div style={{ color: ENERGY_TYPES.find(e => e.id === hoveredEnergy)?.color }}>
                            {ENERGY_TYPES.find(e => e.id === hoveredEnergy)?.icon}
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            {ENERGY_TYPES.find(e => e.id === hoveredEnergy)?.label}
                          </span>
                        </div>
                        <p className="text-[9px] text-white/60 leading-relaxed">
                          {ENERGY_TYPES.find(e => e.id === hoveredEnergy)?.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Presets */}
                <div className="flex gap-2 overflow-x-auto pb-2 pointer-events-auto no-scrollbar">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={(e) => { e.stopPropagation(); applyPreset(p); }}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all pointer-events-auto"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Mode Selector (Scrollable) */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 overflow-x-auto pb-2 pointer-events-auto no-scrollbar snap-x">
                    {MODES.map((m) => {
                      const isActive = modes.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          onMouseEnter={() => setHoveredMode(m.id)}
                          onMouseLeave={() => setHoveredMode(null)}
                          onTouchStart={() => setHoveredMode(m.id)}
                          onTouchEnd={() => setTimeout(() => setHoveredMode(null), 1500)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModes(prev => {
                              const isSpecial = m.id === 'pan' || m.id === 'zoom';
                              if (isSpecial) {
                                const otherSpecial = m.id === 'pan' ? 'zoom' : 'pan';
                                if (prev.includes(m.id)) {
                                  return prev.length > 1 ? prev.filter(id => id !== m.id) : prev;
                                } else {
                                  return [...prev.filter(id => id !== otherSpecial), m.id];
                                }
                              } else {
                                if (prev.includes(m.id)) {
                                  return prev.length > 1 ? prev.filter(id => id !== m.id) : prev;
                                } else {
                                  return [...prev, m.id];
                                }
                              }
                            });
                          }}
                          className={`flex-shrink-0 snap-start flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 active:scale-90 pointer-events-auto relative overflow-hidden group backdrop-blur-xl ${
                            isActive 
                            ? 'bg-white/10 border-white/40 text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="mode-active-pill"
                              className="absolute inset-0 bg-white/5"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className="relative z-10">{m.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] relative z-10">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mode Tooltip */}
                  <AnimatePresence mode="wait">
                    {hoveredMode && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="mx-2 p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-cyan-400">
                            {MODES.find(m => m.id === hoveredMode)?.icon}
                          </div>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {MODES.find(m => m.id === hoveredMode)?.label}
                          </span>
                        </div>
                        <p className="text-[9px] text-white/50 leading-relaxed font-medium">
                          {MODES.find(m => m.id === hoveredMode)?.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stats Bar */}
                <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#00ffcc]">{config.particleCount}</span>
                      <span className="text-[8px] uppercase text-white/30">อนุภาค</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#ff3300]">{forces.length}</span>
                      <span className="text-[8px] uppercase text-white/30">สนามพลัง</span>
                    </div>
                  </div>
                  <div className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                    {modes.map(id => MODES.find(m => m.id === id)?.label).join(' + ')}
                  </div>
                </div>

                {/* Quantum Controls */}
                <AnimatePresence>
                  {modes.includes('quantum') && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-2 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 overflow-hidden shadow-xl"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Quantum Systems</span>
                        <div className="flex gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${quantumSettings.measurementActive ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setQuantumSettings(prev => ({ ...prev, isQuantumEnergyView: !prev.isQuantumEnergyView }))}
                          className={`py-2 rounded-lg border text-[9px] font-bold transition-all backdrop-blur-md ${quantumSettings.isQuantumEnergyView ? 'bg-white/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                          Energy View
                        </button>
                        <button 
                          onClick={() => setQuantumSettings(prev => ({ ...prev, showProbabilityCloud: !prev.showProbabilityCloud }))}
                          className={`py-2 rounded-lg border text-[9px] font-bold transition-all backdrop-blur-md ${quantumSettings.showProbabilityCloud ? 'bg-white/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                          Prob Cloud
                        </button>
                        <button 
                          onClick={() => setQuantumSettings(prev => ({ ...prev, showEntanglement: !prev.showEntanglement }))}
                          className={`py-2 rounded-lg border text-[9px] font-bold transition-all backdrop-blur-md ${quantumSettings.showEntanglement ? 'bg-white/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                          Entangle
                        </button>
                        <button 
                          onClick={() => setQuantumSettings(prev => ({ ...prev, isWaveMode: !prev.isWaveMode }))}
                          className={`py-2 rounded-lg border text-[9px] font-bold transition-all backdrop-blur-md ${quantumSettings.isWaveMode ? 'bg-white/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                          Wave/Particle
                        </button>
                        <button 
                          onClick={() => {
                            setQuantumSettings(prev => ({ ...prev, measurementActive: true }));
                            setTimeout(() => setQuantumSettings(prev => ({ ...prev, measurementActive: false })), 500);
                            particlesRef.current.forEach(p => {
                              if (Math.random() < 0.3) {
                                p.quantumState.isCollapsed = true;
                                collisionEffectsRef.current.push(new CollisionEffect(p.x, p.y, 'burst', '#ffffff', config.highDefinition));
                                setTimeout(() => p.quantumState.isCollapsed = false, 2000);
                              }
                            });
                          }}
                          className="py-2 rounded-lg border border-cyan-400/50 bg-white/10 backdrop-blur-md text-cyan-400 text-[9px] font-bold active:scale-95 hover:bg-white/20 transition-all"
                        >
                          Measure
                        </button>
                        <button 
                          onClick={() => {
                            particlesRef.current.forEach(p => {
                              p.quantumState.isCollapsed = true;
                              collisionEffectsRef.current.push(new CollisionEffect(p.x, p.y, 'explosion', '#ffffff', config.highDefinition));
                              setTimeout(() => p.quantumState.isCollapsed = false, 1000);
                            });
                          }}
                          className="py-2 rounded-lg border border-red-400/50 bg-white/10 backdrop-blur-md text-red-400 text-[9px] font-bold active:scale-95 hover:bg-white/20 transition-all"
                        >
                          Collapse
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 w-full max-w-[280px] h-full bg-white/5 backdrop-blur-3xl border-l border-white/10 p-6 pointer-events-auto flex flex-col gap-6 overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-widest text-white/80">การตั้งค่า</h2>
              <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>ความหนาแน่นอนุภาค</span>
                  <span>{config.particleCount}</span>
                </div>
                <input 
                  type="range" min="100" max="3000" step="100"
                  value={config.particleCount}
                  onChange={(e) => setConfig({...config, particleCount: parseInt(e.target.value)})}
                  className="w-full accent-[#00ffcc]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>ความแรงของพลังงาน</span>
                  <span>{config.forceStrengthMult.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.1" max="5.0" step="0.1"
                  value={config.forceStrengthMult}
                  onChange={(e) => setConfig({...config, forceStrengthMult: parseFloat(e.target.value)})}
                  className="w-full accent-[#ff3300]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>รัศมีสนามพลัง</span>
                  <span>{config.forceRadiusMult.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="5.0" step="0.1"
                  value={config.forceRadiusMult}
                  onChange={(e) => setConfig({...config, forceRadiusMult: parseFloat(e.target.value)})}
                  className="w-full accent-[#00ffff]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>ความเร็วการจำลอง</span>
                  <span>{config.speedMult.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.1" max="3.0" step="0.1"
                  value={config.speedMult}
                  onChange={(e) => setConfig({...config, speedMult: parseFloat(e.target.value)})}
                  className="w-full accent-[#6600ff]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>ความสว่าง (Glow)</span>
                  <span>{config.glowLevel.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0" max="8.0" step="0.5"
                  value={config.glowLevel}
                  onChange={(e) => setConfig({...config, glowLevel: parseFloat(e.target.value)})}
                  className="w-full accent-[#ffff00]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>อัตราการแปรสภาพ</span>
                  <span>{(config.stateChangeRate * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1.0" step="0.01"
                  value={config.stateChangeRate}
                  onChange={(e) => setConfig({...config, stateChangeRate: parseFloat(e.target.value)})}
                  className="w-full accent-[#00ffcc]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>ระดับการรวมตัว/ระเบิด</span>
                  <span>{config.aggregationLevel.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0" max="5.0" step="0.1"
                  value={config.aggregationLevel}
                  onChange={(e) => setConfig({...config, aggregationLevel: parseFloat(e.target.value), explosionLevel: parseFloat(e.target.value)})}
                  className="w-full accent-[#ffcc00]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>ระดับพายุน้ำวน</span>
                  <span>{config.vortexLevel.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0" max="5.0" step="0.1"
                  value={config.vortexLevel}
                  onChange={(e) => setConfig({...config, vortexLevel: parseFloat(e.target.value)})}
                  className="w-full accent-[#6600ff]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-white/40">การชนกันของอะตอม</span>
                <button 
                  onClick={() => setConfig({...config, enableCollisions: !config.enableCollisions})}
                  className={`w-10 h-5 rounded-full transition-all ${config.enableCollisions ? 'bg-[#00ffcc]' : 'bg-white/10'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-all ${config.enableCollisions ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  socketRef.current?.emit('clearForces');
                  setForces([]);
                  forcesRef.current = [];
                }}
                className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                ล้างสนามพลังทั้งหมด
              </button>

              <div className="mt-auto pt-6 border-t border-white/5 text-[8px] text-white/20 text-center uppercase tracking-widest">
                Cosmic Engine v3.0.0
              </div>
              <div className="pt-4 border-t border-white/10">
                <button 
                  onClick={resetSimulation}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCcw size={14} />
                  รีเซ็ตระบบทั้งหมด
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantum World Overlay */}
      <QuantumWorld 
        isOpen={isQuantumWorld}
        onClose={() => setIsQuantumWorld(false)}
        quantumSettings={quantumSettings}
        setQuantumSettings={setQuantumSettings}
        onMeasure={handleMeasure}
        onCollapse={handleCollapse}
        collisionHistory={collisionHistory}
        activeCollisionResult={activeCollisionResult}
        setActiveCollisionResult={setActiveCollisionResult}
        onStartCollision={handleStartCollision}
        onResetLab={resetLab}
      />

      {/* Interaction Hints (First touch) */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse text-[10px] uppercase tracking-[0.3em] text-white/20 text-center">
        แตะ: ดึงดูด • กดค้าง: ผลัก • ลาก: พายุน้ำวน • สร้าง: ลากเพื่อยิงอนุภาค
      </div>
    </div>
  );
}
