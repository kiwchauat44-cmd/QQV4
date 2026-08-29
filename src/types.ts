export interface Point {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  x: number;
  y: number;
  color: string;
}

export type ParticleType = 
  | 'energy' | 'matter' | 'light-atom' | 'heavy-atom' | 'neutral' | 'electric' | 'nuclear' | 'cosmic' | 'universal' | 'dark-matter' | 'quark' | 'planet-core' | 'antimatter' | 'plasma' | 'photon'
  // Basic
  | 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'darkness' | 'lightning' | 'ice'
  // Physics
  | 'thermal' | 'magnetic' | 'sound-wave' | 'pressure' | 'gravity' | 'shockwave'
  // Particle
  | 'electron' | 'proton' | 'neutron' | 'ion' | 'neutrino' | 'boson'
  // Cosmic
  | 'stellar' | 'solar' | 'lunar' | 'cosmic-ray' | 'nebula' | 'black-hole' | 'supernova'
  // Exotic
  | 'liquid-metal' | 'crystal' | 'toxic-gas' | 'radiation' | 'quantum-matter' | 'bio-energy' | 'psionic' | 'mutating-matter';

export type ForceType = 
  | 'attractor' | 'repulsor' | 'vortex' | 'dispersion' | 'central' | 'electric' | 'nuclear' | 'atomic' | 'matter' | 'cosmic' | 'universal' | 'field' | 'transform' | 'light-atom' | 'heavy-atom' | 'neutral' | 'dark-matter' | 'quark' | 'antimatter' | 'plasma' | 'void' | 'gravity-wave' | 'photon'
  // Basic
  | 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'darkness' | 'lightning' | 'ice'
  // Physics
  | 'thermal' | 'magnetic' | 'sound-wave' | 'pressure' | 'gravity' | 'shockwave'
  // Particle
  | 'electron' | 'proton' | 'neutron' | 'ion' | 'neutrino' | 'boson'
  // Cosmic
  | 'stellar' | 'solar' | 'lunar' | 'cosmic-ray' | 'nebula' | 'black-hole' | 'supernova'
  // Exotic
  | 'liquid-metal' | 'crystal' | 'toxic-gas' | 'radiation' | 'quantum-matter' | 'bio-energy' | 'psionic' | 'mutating-matter';

export type SimulationMode = 'static' | 'chaos' | 'aggregation' | 'explosion' | 'vortex' | 'transformation' | 'big-bang' | 'neural-network' | 'zoom' | 'pan' | 'spawn-particle' | 'black-hole' | 'supernova' | 'nebula' | 'galaxy' | 'wormhole' | 'pulsar' | 'dark-energy' | 'quantum';

export interface QuantumState {
  spin: number; // -1 to 1
  phase: number; // 0 to 2PI
  coherence: number; // 0 to 1
  energyLevel: number; // 0 to 5
  entangledWith: string | null; // ID of another particle
  probabilityCloud: number; // 0 to 1
  isCollapsed: boolean;
}

export type ParticleMotion =
  | 'radiant'
  | 'wave'
  | 'orbital'
  | 'fluid'
  | 'anchored'
  | 'turbulent'
  | 'attractor'
  | 'quantum';

export interface ParticleBehaviorProfile {
  label: string;
  detail: string;
  motion: ParticleMotion;
  inertia: number;
  maxSpeed: number;
  forceResponse: number;
  interactionRadius: number;
  centerPull: number;
  radialDrive: number;
  orbitDrive: number;
  turbulence: number;
  energyDrift: number;
  pulseSpeed: number;
  trailFactor: number;
  collisionEnergy: number;
}

const DEFAULT_PARTICLE_BEHAVIOR: Omit<ParticleBehaviorProfile, 'label' | 'detail'> = {
  motion: 'fluid',
  inertia: 0.975,
  maxSpeed: 10,
  forceResponse: 1,
  interactionRadius: 1,
  centerPull: 0,
  radialDrive: 0,
  orbitDrive: 0,
  turbulence: 0.05,
  energyDrift: 0,
  pulseSpeed: 0.08,
  trailFactor: 0.2,
  collisionEnergy: 0.04,
};

/**
 * Intrinsic behaviour profile. This is deliberately separate from the global
 * simulation modes: a fire particle should still feel different from water
 * while both are inside the same mode.
 */
export function getParticleBehaviorProfile(type: ParticleType): ParticleBehaviorProfile {
  const profile = (label: string, detail: string, overrides: Partial<ParticleBehaviorProfile>): ParticleBehaviorProfile => ({
    ...DEFAULT_PARTICLE_BEHAVIOR,
    label,
    detail,
    ...overrides,
  });

  switch (type) {
    case 'energy':
      return profile('แผ่รัศมี', 'พลังงานเบา เร่งออกจากบริเวณหนาแน่นและเรืองแสงตามระดับพลังงาน', { motion: 'radiant', maxSpeed: 14, forceResponse: 1.35, radialDrive: 0.035, energyDrift: 0.001, pulseSpeed: 0.14, trailFactor: 0.75, collisionEnergy: 0.08 });
    case 'matter':
      return profile('มวลเฉื่อย', 'มวลทั่วไปเคลื่อนที่ช้ากว่า รักษาโมเมนตัม และรวมตัวได้ง่าย', { motion: 'anchored', inertia: 0.958, maxSpeed: 6, forceResponse: 0.72, interactionRadius: 1.1, centerPull: 0.012, trailFactor: 0.12, collisionEnergy: 0.06 });
    case 'electric':
      return profile('ประจุสั่นไหว', 'ประจุเบาเปลี่ยนทิศฉับพลันและตอบสนองต่อสนามไฟฟ้ารุนแรง', { motion: 'turbulent', inertia: 0.99, maxSpeed: 20, forceResponse: 1.8, turbulence: 0.34, energyDrift: 0.001, pulseSpeed: 0.2, trailFactor: 0.85, collisionEnergy: 0.1 });
    case 'nuclear':
      return profile('แกนพลังงาน', 'มวลหนาแน่นสะสมพลังงานแล้วปล่อยแรงผลักเป็นระยะ', { motion: 'radiant', inertia: 0.965, maxSpeed: 8, forceResponse: 0.7, radialDrive: 0.06, energyDrift: 0.0015, pulseSpeed: 0.17, trailFactor: 0.6, collisionEnergy: 0.13 });
    case 'cosmic':
      return profile('โคจรจักรวาล', 'เคลื่อนเป็นวงโคจรพร้อมแรงดึงเข้าศูนย์กลางเล็กน้อย', { motion: 'orbital', inertia: 0.982, maxSpeed: 10, forceResponse: 1.05, centerPull: 0.006, orbitDrive: 0.095, pulseSpeed: 0.06, trailFactor: 0.45, collisionEnergy: 0.06 });
    case 'universal':
      return profile('แรงสากล', 'มีอิทธิพลต่อทุกสิ่ง ดึงเข้าศูนย์กลางและต้านการเปลี่ยนทิศ', { motion: 'attractor', inertia: 0.992, maxSpeed: 6, forceResponse: 2.1, interactionRadius: 1.35, centerPull: 0.11, pulseSpeed: 0.04, trailFactor: 0.25, collisionEnergy: 0.12 });
    case 'light-atom':
      return profile('อะตอมเบา', 'พุ่งเร็ว สะท้อนแรงง่าย และสั่นเป็นคลื่นเมื่อถูกรบกวน', { motion: 'wave', inertia: 0.992, maxSpeed: 22, forceResponse: 1.55, turbulence: 0.12, radialDrive: 0.04, pulseSpeed: 0.16, trailFactor: 0.9, collisionEnergy: 0.07 });
    case 'heavy-atom':
      return profile('อะตอมหนัก', 'มีความเฉื่อยสูง ตอบสนองช้าแต่ชนแล้วถ่ายโอนแรงมาก', { motion: 'anchored', inertia: 0.945, maxSpeed: 5, forceResponse: 0.48, interactionRadius: 1.2, centerPull: 0.018, trailFactor: 0.08, collisionEnergy: 0.11 });
    case 'planet-core':
      return profile('แกนดาวเคราะห์', 'มวลหนาแน่นยึดตัวเองไว้และสร้างวงแรงโน้มถ่วงรอบแกน', { motion: 'attractor', inertia: 0.92, maxSpeed: 4, forceResponse: 1.65, interactionRadius: 1.4, centerPull: 0.12, orbitDrive: 0.025, pulseSpeed: 0.025, trailFactor: 0.06, collisionEnergy: 0.14 });
    case 'neutral':
      return profile('เป็นกลาง', 'ไม่ถูกผลักด้วยประจุโดยตรง จึงเคลื่อนนุ่มและเสถียร', { motion: 'anchored', inertia: 0.972, maxSpeed: 7, forceResponse: 0.6, turbulence: 0.02, trailFactor: 0.1, collisionEnergy: 0.035 });
    case 'dark-matter':
      return profile('สสารมืด', 'มองไม่เห็นและต้านสนามส่วนใหญ่ แต่ตอบสนองต่อแรงโน้มถ่วงอย่างมาก', { motion: 'attractor', inertia: 0.995, maxSpeed: 5, forceResponse: 2.5, interactionRadius: 1.5, centerPull: 0.075, pulseSpeed: 0.025, trailFactor: 0.15, collisionEnergy: 0.09 });
    case 'quark':
      return profile('ควาร์กสั่นพ้อง', 'สั่นเร็ว เปลี่ยนเฟสและสีตลอดเวลา พร้อมการกระจายตัวแบบสุ่ม', { motion: 'turbulent', inertia: 0.998, maxSpeed: 24, forceResponse: 1.6, turbulence: 0.72, energyDrift: 0.002, pulseSpeed: 0.28, trailFactor: 1, collisionEnergy: 0.14 });
    case 'antimatter':
      return profile('ปฏิสสาร', 'เร่งหนีมวลรอบข้างอย่างรุนแรงและปล่อยพลังงานเมื่อชน', { motion: 'radiant', inertia: 0.99, maxSpeed: 18, forceResponse: 1.9, radialDrive: 0.13, energyDrift: 0.001, pulseSpeed: 0.2, trailFactor: 0.95, collisionEnergy: 0.2 });
    case 'plasma':
      return profile('พลาสมาเดือด', 'ของไหลมีประจุหมุนวนและเกิดความปั่นป่วนจากความร้อน', { motion: 'turbulent', inertia: 0.985, maxSpeed: 18, forceResponse: 1.35, turbulence: 0.45, radialDrive: 0.05, energyDrift: 0.002, pulseSpeed: 0.18, trailFactor: 0.8, collisionEnergy: 0.09 });
    case 'photon':
      return profile('โฟตอน', 'เคลื่อนที่เร็วมากเป็นเส้นทางแผ่รัศมีและถ่ายเทพลังงานเมื่อดูดกลืน', { motion: 'radiant', inertia: 0.999, maxSpeed: 28, forceResponse: 1.45, radialDrive: 0.09, pulseSpeed: 0.24, trailFactor: 1, collisionEnergy: 0.08 });
    case 'fire':
      return profile('เปลวไฟ', 'ลอยขึ้น แผ่รัศมี และสั่นแรงขึ้นเมื่อมีพลังงานสูง', { motion: 'radiant', inertia: 0.982, maxSpeed: 16, forceResponse: 1.25, radialDrive: 0.07, turbulence: 0.28, energyDrift: 0.001, pulseSpeed: 0.2, trailFactor: 0.85, collisionEnergy: 0.08 });
    case 'water':
      return profile('กระแสน้ำ', 'ไหลต่อเนื่อง โค้งตามแรง และรวมตัวเป็นกลุ่มนุ่มนวล', { motion: 'fluid', inertia: 0.978, maxSpeed: 10, forceResponse: 0.9, centerPull: 0.008, turbulence: 0.08, pulseSpeed: 0.055, trailFactor: 0.3, collisionEnergy: 0.045 });
    case 'wind':
      return profile('กระแสลม', 'เบาและเร็ว เปลี่ยนทิศเป็นคลื่นโดยแทบไม่สูญเสียความเร็ว', { motion: 'wave', inertia: 0.994, maxSpeed: 20, forceResponse: 1.25, turbulence: 0.22, pulseSpeed: 0.11, trailFactor: 0.7, collisionEnergy: 0.035 });
    case 'earth':
      return profile('มวลดิน', 'หนักแน่น เคลื่อนช้า ดูดเข้าหากันและต้านการกระเด้ง', { motion: 'anchored', inertia: 0.938, maxSpeed: 5, forceResponse: 0.5, interactionRadius: 1.25, centerPull: 0.022, pulseSpeed: 0.035, trailFactor: 0.05, collisionEnergy: 0.08 });
    case 'light':
      return profile('ลำแสง', 'แผ่จากจุดกำเนิดเป็นทางตรงและเรืองสว่างชัดเจน', { motion: 'radiant', inertia: 0.997, maxSpeed: 24, forceResponse: 1.5, radialDrive: 0.065, pulseSpeed: 0.23, trailFactor: 1, collisionEnergy: 0.06 });
    case 'darkness':
      return profile('เงามืด', 'ดูดกลืนความสว่างและค่อย ๆ ลากอนุภาคเข้าหาแกนกลาง', { motion: 'attractor', inertia: 0.987, maxSpeed: 8, forceResponse: 1.25, interactionRadius: 1.2, centerPull: 0.05, energyDrift: -0.001, pulseSpeed: 0.03, trailFactor: 0.12, collisionEnergy: 0.07 });
    case 'lightning':
      return profile('สายฟ้า', 'พุ่งเป็นจังหวะ กระโดดทิศทาง และสะสมประจุจากการชน', { motion: 'turbulent', inertia: 0.996, maxSpeed: 25, forceResponse: 1.9, turbulence: 0.8, energyDrift: 0.002, pulseSpeed: 0.3, trailFactor: 1, collisionEnergy: 0.12 });
    case 'ice':
      return profile('ผลึกน้ำแข็ง', 'เคลื่อนช้า เป็นระเบียบ และสูญเสียพลังงานอย่างรวดเร็ว', { motion: 'anchored', inertia: 0.946, maxSpeed: 6, forceResponse: 0.65, centerPull: 0.012, energyDrift: -0.0015, pulseSpeed: 0.025, trailFactor: 0.06, collisionEnergy: 0.04 });
    case 'thermal':
      return profile('ความร้อน', 'สั่นแบบสุ่มและกระจายออกเมื่ออุณหภูมิสูงขึ้น', { motion: 'turbulent', inertia: 0.985, maxSpeed: 15, forceResponse: 1.15, turbulence: 0.36, radialDrive: 0.045, energyDrift: 0.001, pulseSpeed: 0.16, trailFactor: 0.7, collisionEnergy: 0.07 });
    case 'magnetic':
      return profile('สนามแม่เหล็ก', 'โค้งเป็นวงโคจรและเบนทิศตามความเร็วของตัวเอง', { motion: 'orbital', inertia: 0.989, maxSpeed: 12, forceResponse: 1.35, orbitDrive: 0.14, centerPull: 0.01, pulseSpeed: 0.075, trailFactor: 0.5, collisionEnergy: 0.06 });
    case 'sound-wave':
      return profile('คลื่นเสียง', 'เดินทางเป็นคลื่นอัด-ขยายและส่งแรงสั่นออกเป็นวงแหวน', { motion: 'wave', inertia: 0.99, maxSpeed: 14, forceResponse: 1.1, turbulence: 0.18, pulseSpeed: 0.13, trailFactor: 0.55, collisionEnergy: 0.045 });
    case 'pressure':
      return profile('ความดัน', 'ผลักจากบริเวณหนาแน่นและบีบอัดตัวเองเมื่อเข้าใกล้ศูนย์กลาง', { motion: 'anchored', inertia: 0.965, maxSpeed: 8, forceResponse: 0.85, radialDrive: 0.09, pulseSpeed: 0.06, trailFactor: 0.18, collisionEnergy: 0.06 });
    case 'gravity':
      return profile('แรงโน้มถ่วง', 'ดึงทุกมวลเข้าหากันและเร่งขึ้นเมื่อระยะห่างลดลง', { motion: 'attractor', inertia: 0.99, maxSpeed: 9, forceResponse: 1.8, interactionRadius: 1.3, centerPull: 0.085, orbitDrive: 0.035, pulseSpeed: 0.045, trailFactor: 0.28, collisionEnergy: 0.1 });
    case 'shockwave':
      return profile('คลื่นกระแทก', 'พุ่งออกจากจุดกำเนิดเป็นชั้นแรงดันและลดความเร็วภายหลัง', { motion: 'radiant', inertia: 0.968, maxSpeed: 22, forceResponse: 1.25, radialDrive: 0.28, turbulence: 0.14, pulseSpeed: 0.19, trailFactor: 0.9, collisionEnergy: 0.11 });
    case 'electron':
      return profile('อิเล็กตรอน', 'เบามาก สั่นเร็ว และโคจรรอบศูนย์แรงได้ง่าย', { motion: 'orbital', inertia: 0.996, maxSpeed: 23, forceResponse: 1.75, turbulence: 0.28, orbitDrive: 0.11, pulseSpeed: 0.21, trailFactor: 0.9, collisionEnergy: 0.09 });
    case 'proton':
      return profile('โปรตอน', 'ประจุบวกมีมวลปานกลาง ดึงดูดเชิงโครงสร้างและชนค่อนข้างแน่น', { motion: 'anchored', inertia: 0.956, maxSpeed: 8, forceResponse: 0.85, centerPull: 0.016, pulseSpeed: 0.06, trailFactor: 0.18, collisionEnergy: 0.08 });
    case 'neutron':
      return profile('นิวตรอน', 'เป็นกลางและมีความเสถียรสูง จึงเคลื่อนตรงก่อนค่อย ๆ ช้าลง', { motion: 'anchored', inertia: 0.963, maxSpeed: 8, forceResponse: 0.7, turbulence: 0.015, pulseSpeed: 0.04, trailFactor: 0.12, collisionEnergy: 0.055 });
    case 'ion':
      return profile('ไอออน', 'ประจุมีมวลปานกลาง ส่ายตามสนามและปล่อยพลังงานเมื่อเร่ง', { motion: 'turbulent', inertia: 0.989, maxSpeed: 18, forceResponse: 1.5, turbulence: 0.32, energyDrift: 0.001, pulseSpeed: 0.17, trailFactor: 0.72, collisionEnergy: 0.09 });
    case 'neutrino':
      return profile('นิวทริโน', 'เบาและทะลุผ่านง่าย แทบไม่ถูกแรงชนรบกวน', { motion: 'wave', inertia: 0.998, maxSpeed: 26, forceResponse: 0.25, interactionRadius: 0.55, turbulence: 0.04, pulseSpeed: 0.18, trailFactor: 0.65, collisionEnergy: 0.018 });
    case 'boson':
      return profile('โบซอน', 'เป็นตัวกลางของแรง สั่นเป็นคลื่นและถ่ายโอนพลังงานระหว่างอนุภาค', { motion: 'wave', inertia: 0.994, maxSpeed: 21, forceResponse: 1.2, turbulence: 0.16, energyDrift: 0.001, pulseSpeed: 0.15, trailFactor: 0.75, collisionEnergy: 0.075 });
    case 'stellar':
      return profile('ดาวฤกษ์', 'มวลมาก โคจรช้าและมีแกนร้อนที่เรืองแสงต่อเนื่อง', { motion: 'orbital', inertia: 0.972, maxSpeed: 8, forceResponse: 1.25, centerPull: 0.025, orbitDrive: 0.16, energyDrift: 0.001, pulseSpeed: 0.09, trailFactor: 0.35, collisionEnergy: 0.12 });
    case 'solar':
      return profile('สุริยะ', 'แผ่รังสีรอบตัวและเร่งอนุภาคโดยรอบตามระดับความร้อน', { motion: 'radiant', inertia: 0.984, maxSpeed: 14, forceResponse: 1.35, radialDrive: 0.1, turbulence: 0.25, energyDrift: 0.0015, pulseSpeed: 0.17, trailFactor: 0.75, collisionEnergy: 0.09 });
    case 'lunar':
      return profile('จันทรา', 'โคจรนุ่มนวล สะท้อนแรงและเปลี่ยนเฟสช้า', { motion: 'orbital', inertia: 0.978, maxSpeed: 9, forceResponse: 0.8, orbitDrive: 0.09, centerPull: 0.012, energyDrift: -0.0005, pulseSpeed: 0.035, trailFactor: 0.28, collisionEnergy: 0.045 });
    case 'cosmic-ray':
      return profile('รังสีคอสมิก', 'พุ่งเร็วเป็นเส้นตรงและแทรกผ่านบริเวณต่าง ๆ ด้วยพลังงานสูง', { motion: 'radiant', inertia: 0.999, maxSpeed: 27, forceResponse: 1.2, radialDrive: 0.12, energyDrift: 0.001, pulseSpeed: 0.26, trailFactor: 1, collisionEnergy: 0.1 });
    case 'nebula':
      return profile('เนบิวลา', 'เป็นกลุ่มก๊าซไหลวน กระจายตัวช้า และก่อตัวเป็นริ้วหมอก', { motion: 'fluid', inertia: 0.982, maxSpeed: 9, forceResponse: 0.8, centerPull: 0.004, turbulence: 0.24, pulseSpeed: 0.045, trailFactor: 0.38, collisionEnergy: 0.04 });
    case 'black-hole':
      return profile('หลุมดำ', 'ดึงดูดรุนแรงมากและลดความเร็วของทุกสิ่งเมื่อเข้าใกล้ขอบฟ้าเหตุการณ์', { motion: 'attractor', inertia: 0.998, maxSpeed: 4, forceResponse: 2.8, interactionRadius: 1.65, centerPull: 0.18, orbitDrive: 0.08, pulseSpeed: 0.02, trailFactor: 0.2, collisionEnergy: 0.16 });
    case 'supernova':
      return profile('ซูเปอร์โนวา', 'ระเบิดแผ่รัศมีด้วยความเร็วสูงและเพิ่มพลังงานต่อเนื่อง', { motion: 'radiant', inertia: 0.99, maxSpeed: 26, forceResponse: 1.65, radialDrive: 0.3, turbulence: 0.26, energyDrift: 0.003, pulseSpeed: 0.25, trailFactor: 1, collisionEnergy: 0.18 });
    case 'liquid-metal':
      return profile('โลหะเหลว', 'ไหลรวมเป็นหยดหนักและตอบสนองต่อแม่เหล็กมากกว่าสสารทั่วไป', { motion: 'fluid', inertia: 0.956, maxSpeed: 8, forceResponse: 1.2, centerPull: 0.016, turbulence: 0.12, pulseSpeed: 0.07, trailFactor: 0.22, collisionEnergy: 0.07 });
    case 'crystal':
      return profile('คริสตัล', 'คงรูปเป็นระเบียบ สั่นเป็นจังหวะ และรับแรงได้มากก่อนแตกตัว', { motion: 'anchored', inertia: 0.93, maxSpeed: 5, forceResponse: 0.58, interactionRadius: 1.2, centerPull: 0.02, pulseSpeed: 0.08, trailFactor: 0.04, collisionEnergy: 0.095 });
    case 'toxic-gas':
      return profile('ก๊าซพิษ', 'ฟุ้งกระจายแบบปั่นป่วนและทิ้งริ้วร่องรอยไว้รอบตัว', { motion: 'fluid', inertia: 0.984, maxSpeed: 13, forceResponse: 1.05, radialDrive: 0.055, turbulence: 0.5, energyDrift: 0.0005, pulseSpeed: 0.13, trailFactor: 0.68, collisionEnergy: 0.055 });
    case 'radiation':
      return profile('รังสี', 'แผ่พลังงานออกทุกทิศและทำให้อนุภาครอบข้างตื่นตัว', { motion: 'radiant', inertia: 0.997, maxSpeed: 23, forceResponse: 1.45, radialDrive: 0.14, energyDrift: 0.002, pulseSpeed: 0.22, trailFactor: 0.95, collisionEnergy: 0.1 });
    case 'quantum-matter':
      return profile('สสารควอนตัม', 'สลับระหว่างความเป็นคลื่นกับอนุภาคและเปลี่ยนตำแหน่งแบบไม่ต่อเนื่อง', { motion: 'quantum', inertia: 0.996, maxSpeed: 17, forceResponse: 1.2, interactionRadius: 1.15, turbulence: 0.18, pulseSpeed: 0.12, trailFactor: 0.55, collisionEnergy: 0.08 });
    case 'bio-energy':
      return profile('พลังงานชีวภาพ', 'เติบโตเมื่อรวมกลุ่มและเคลื่อนที่เป็นจังหวะคล้ายการเต้นของสิ่งมีชีวิต', { motion: 'fluid', inertia: 0.974, maxSpeed: 11, forceResponse: 0.95, centerPull: 0.014, turbulence: 0.15, energyDrift: 0.001, pulseSpeed: 0.16, trailFactor: 0.4, collisionEnergy: 0.065 });
    case 'psionic':
      return profile('พลังจิต', 'เคลื่อนแบบคาดเดายาก มีวงโคจรเล็กและไวต่อสนามควอนตัม', { motion: 'quantum', inertia: 0.989, maxSpeed: 15, forceResponse: 1.3, orbitDrive: 0.07, turbulence: 0.28, pulseSpeed: 0.14, trailFactor: 0.5, collisionEnergy: 0.07 });
    case 'mutating-matter':
      return profile('สสารแปรผัน', 'เปลี่ยนรูปแบบการเคลื่อนที่ตลอดเวลาและเร่งขึ้นเมื่อเกิดการกลายพันธุ์', { motion: 'turbulent', inertia: 0.978, maxSpeed: 16, forceResponse: 1.15, turbulence: 0.42, energyDrift: 0.0012, pulseSpeed: 0.19, trailFactor: 0.6, collisionEnergy: 0.085 });
    default:
      return profile('อนุภาคทั่วไป', 'พฤติกรรมสมดุลระหว่างการไหล การชน และการตอบสนองต่อสนาม', {});
  }
}

export interface Force {
  id: string;
  x: number;
  y: number;
  type: ForceType;
  strength: number;
  radius: number;
  createdAt: number;
  duration: number;
  color?: string;
  // Dynamic properties
  behavior?: 'static' | 'pulsate' | 'wander' | 'orbit';
  phase?: number;
  speed?: number;
  baseRadius?: number;
  baseStrength?: number;
  baseX?: number;
  baseY?: number;
  vx?: number;
  vy?: number;
}

export class Star {
  x: number;
  y: number;
  baseSize: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  twinkleOffset: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseSize = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.005 + Math.random() * 0.02;
    this.twinkleOffset = Math.random() * 100;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.pulse += this.pulseSpeed;
    
    // Twinkle effect: vary opacity and size subtly
    const twinkle = Math.sin(this.pulse + this.twinkleOffset);
    const currentOpacity = this.opacity * (0.6 + twinkle * 0.4);
    const currentSize = this.baseSize * (0.8 + twinkle * 0.2);
    
    // Add a very subtle glow for larger stars
    if (this.baseSize > 1.2) {
      ctx.shadowBlur = 4 * (0.5 + twinkle * 0.5);
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

export type CollisionEffectType = 'sparks' | 'explosion' | 'transfer' | 'burst' | 'fragment' | 'shockwave' | 'excitation' | 'emission' | 'absorption' | 'tunneling' | 'entanglement' | 'decoherence' | 'transition' | 'interference';

export interface CollisionResult {
  id: string;
  timestamp: number;
  typeA: ParticleType;
  typeB?: ParticleType;
  outcome: string;
  energyChange: number;
  stability: number; // 0 to 1
  newParticles: number;
  events: CollisionEffectType[];
  description: string;
}

export class CollisionEffect {
  x: number;
  y: number;
  type: CollisionEffectType;
  life: number; // 1.0 to 0.0
  maxLife: number;
  color: string;
  particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; rotation?: number; rotationSpeed?: number }[] = [];

  constructor(x: number, y: number, type: CollisionEffectType, color: string, isHD: boolean = true) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.life = 1.0;
    
    const densityMult = isHD ? 1.0 : 0.4;
    
    switch(type) {
      case 'explosion': this.maxLife = 50; break;
      case 'sparks': this.maxLife = 35; break;
      case 'burst': this.maxLife = 45; break;
      case 'fragment': this.maxLife = 40; break;
      case 'shockwave': this.maxLife = 30; break;
      case 'transfer': this.maxLife = 25; break;
      case 'excitation': this.maxLife = 40; break;
      case 'emission': this.maxLife = 30; break;
      case 'absorption': this.maxLife = 30; break;
      case 'tunneling': this.maxLife = 20; break;
      case 'entanglement': this.maxLife = 80; break;
      case 'decoherence': this.maxLife = 55; break;
      case 'transition': this.maxLife = 60; break;
      case 'interference': this.maxLife = 70; break;
      default: this.maxLife = 30;
    }
    
    this.initParticles(densityMult);
  }

  initParticles(densityMult: number) {
    const type = this.type;
    if (type === 'sparks') {
      const count = Math.floor(18 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 10;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 0.5 + Math.random() * 2.5,
          alpha: 1.0
        });
      }
    } else if (type === 'explosion') {
      const count = Math.floor(30 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 7,
          alpha: 1.0
        });
      }
    } else if (type === 'burst') {
      const count = Math.floor(25 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 6 + Math.random() * 12;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 4,
          alpha: 1.0
        });
      }
    } else if (type === 'entanglement') {
      const count = 5;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        this.particles.push({
          x: Math.cos(angle) * 20,
          y: Math.sin(angle) * 20,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 2,
          alpha: 1.0
        });
      }
    } else if (type === 'interference') {
      const count = Math.floor(10 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1,
          alpha: 1.0
        });
      }
    } else if (type === 'fragment') {
      const count = Math.floor(15 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 5,
          alpha: 1.0,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3
        });
      }
    } else if (type === 'transfer') {
      const count = Math.floor(10 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5,
          alpha: 1.0
        });
      }
    } else if (type === 'excitation') {
      const count = Math.floor(5 * densityMult) || 1;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: (i + 1) * 10,
          alpha: 1.0
        });
      }
    } else if (type === 'emission') {
      const count = Math.floor(12 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 8;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5,
          alpha: 1.0
        });
      }
    } else if (type === 'absorption') {
      const count = Math.floor(12 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 40;
        this.particles.push({
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          vx: -Math.cos(angle) * 3,
          vy: -Math.sin(angle) * 3,
          size: 2,
          alpha: 1.0
        });
      }
    } else if (type === 'tunneling') {
      const count = Math.floor(8 * densityMult);
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 40,
          vx: 0,
          vy: 0,
          size: 4,
          alpha: 1.0
        });
      }
    } else if (type === 'decoherence') {
      const count = Math.floor(20 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        this.particles.push({
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 2,
          alpha: 1.0,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.5
        });
      }
    } else if (type === 'transition') {
      const count = Math.floor(30 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 4,
          alpha: 1.0
        });
      }
    } else if (type === 'shockwave') {
      const count = Math.floor(8 * densityMult);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 8 + Math.random() * 5;
        this.particles.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 2,
          alpha: 1.0
        });
      }
    }
  }

  update() {
    this.life -= 1 / this.maxLife;
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha = this.life;
      if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
        p.rotation += p.rotationSpeed;
      }
    });
    return this.life > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalCompositeOperation = 'lighter';

    if (this.type === 'sparks') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5);
        ctx.stroke();
        
        // Glow at the tip
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (this.type === 'explosion') {
      const radius = 80 * (1 - this.life);
      if (Number.isFinite(radius) && radius > 0) {
        const bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        bgGrad.addColorStop(0, this.color);
        bgGrad.addColorStop(0.5, this.color + '88');
        bgGrad.addColorStop(1, 'transparent');
        ctx.globalAlpha = this.life * 0.5;
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha * 0.9;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.4 + this.life), 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (this.type === 'burst') {
      // Flash
      if (this.life > 0.85) {
        ctx.globalAlpha = (this.life - 0.85) * 6.6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // Expanding Ring
      ctx.globalAlpha = this.life * 0.8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 80 * (1 - this.life), 0, Math.PI * 2);
      ctx.stroke();

      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
        ctx.stroke();
      });
    } else if (this.type === 'fragment') {
      this.particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = this.color;
        // Draw a small polygon for fragments
        ctx.beginPath();
        ctx.moveTo(-p.size/2, -p.size/2);
        ctx.lineTo(p.size/2, -p.size/3);
        ctx.lineTo(p.size/3, p.size/2);
        ctx.lineTo(-p.size/3, p.size/3);
        ctx.closePath();
        ctx.fill();
        
        // Add a highlight
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = p.alpha * 0.4;
        ctx.fillRect(-p.size/4, -p.size/4, p.size/2, p.size/2);
        ctx.restore();
      });
    } else if (this.type === 'shockwave') {
      ctx.globalAlpha = this.life * 0.6;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 6 * this.life;
      ctx.beginPath();
      ctx.arc(0, 0, 150 * (1 - this.life), 0, Math.PI * 2);
      ctx.stroke();
      
      // Secondary ring
      ctx.globalAlpha = this.life * 0.3;
      ctx.lineWidth = 2 * this.life;
      ctx.beginPath();
      ctx.arc(0, 0, 120 * (1 - this.life), 0, Math.PI * 2);
      ctx.stroke();

      // Debris in shockwave
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (this.type === 'transfer') {
      ctx.globalAlpha = this.life * 0.6;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 40 * (1 - this.life), 0, Math.PI * 2);
      ctx.stroke();

      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect to center
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });
    } else if (this.type === 'excitation') {
      ctx.strokeStyle = this.color;
      ctx.shadowBlur = 15 * this.life;
      ctx.shadowColor = this.color;
      this.particles.forEach((p, i) => {
        ctx.globalAlpha = this.life * (1 - i / 5);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * (1 + (1 - this.life) * 4), 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    } else if (this.type === 'emission') {
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10 * this.life;
      ctx.shadowColor = this.color;
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow trail
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    } else if (this.type === 'entanglement') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      const shimmer = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
      ctx.globalAlpha = this.life * shimmer;
      
      this.particles.forEach((p, i) => {
        const next = this.particles[(i + 1) % this.particles.length];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        
        // Shimmering points
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.setLineDash([]);
    } else if (this.type === 'interference') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.globalAlpha = this.life * (0.5 - i * 0.1);
        ctx.beginPath();
        const r = 20 + i * 15 + (1 - this.life) * 100;
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        
        // Interference fringes
        ctx.save();
        ctx.rotate(Date.now() * 0.001);
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (r - 5), Math.sin(a) * (r - 5));
          ctx.lineTo(Math.cos(a) * (r + 5), Math.sin(a) * (r + 5));
          ctx.stroke();
        }
        ctx.restore();
      }
    } else if (this.type === 'absorption') {
      ctx.fillStyle = this.color;
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha * (1 - this.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Spiral in
        const angle = Math.atan2(p.y, p.x);
        const dist = Math.sqrt(p.x * p.x + p.y * p.y);
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = p.alpha * 0.2;
        ctx.beginPath();
        ctx.arc(0, 0, dist, angle, angle + 0.5);
        ctx.stroke();
      });
    } else if (this.type === 'tunneling') {
      ctx.fillStyle = '#00ffff';
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha * Math.random();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glitch lines
        if (Math.random() < 0.3) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - 10, p.y);
          ctx.lineTo(p.x + 10, p.y);
          ctx.stroke();
        }
      });
    } else if (this.type === 'decoherence') {
      ctx.fillStyle = this.color;
      this.particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
        ctx.restore();
      });
      
      // Shatter effect
      ctx.strokeStyle = '#ffffff';
      ctx.globalAlpha = this.life * 0.3;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
      }
      ctx.stroke();
    } else if (this.type === 'transition') {
      this.particles.forEach((p, i) => {
        const hue = (Date.now() * 0.1 + i * 10) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Rainbow ring
      const centerX = 0;
      const centerY = 0;
      const grad = ctx.createConicGradient(0, centerX, centerY);
      grad.addColorStop(0, 'red');
      grad.addColorStop(0.2, 'yellow');
      grad.addColorStop(0.4, 'green');
      grad.addColorStop(0.6, 'cyan');
      grad.addColorStop(0.8, 'blue');
      grad.addColorStop(1, 'red');
      ctx.strokeStyle = grad;
      ctx.globalAlpha = this.life * 0.5;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 50 * (1 - this.life), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: ParticleType;
  mass: number;
  restitution: number;
  size: number;
  baseSize: number;
  color: string;
  energy: number;
  life: number;
  hue: number;
  isSoundWaveInfluenced: boolean = false;
  behavior: ParticleBehaviorProfile;

  pulse: number;
  id: string;
  quantumState: QuantumState;

  constructor(width: number, height: number, type?: ParticleType) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.type = type || this.getRandomType();
    this.energy = Math.random();
    this.life = 1.0;
    this.pulse = Math.random() * Math.PI * 2;
    this.quantumState = {
      spin: Math.random() > 0.5 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
      coherence: 1.0,
      energyLevel: Math.floor(Math.random() * 3),
      entangledWith: null,
      probabilityCloud: Math.random(),
      isCollapsed: false
    };
    this.initTypeProps();
  }

  public getRandomType(): ParticleType {
    const r = Math.random();
    if (r < 0.1) return 'energy';
    if (r < 0.2) return 'matter';
    if (r < 0.3) return 'electric';
    if (r < 0.4) return 'nuclear';
    if (r < 0.5) return 'cosmic';
    if (r < 0.6) return 'light-atom';
    if (r < 0.7) return 'heavy-atom';
    if (r < 0.75) return 'neutral';
    if (r < 0.8) return 'dark-matter';
    if (r < 0.85) return 'quark';
    if (r < 0.9) return 'antimatter';
    if (r < 0.95) return 'plasma';
    if (r < 0.98) return 'photon';
    return 'universal';
  }

  initTypeProps() {
    this.behavior = getParticleBehaviorProfile(this.type);

    switch (this.type) {
      case 'energy':
        this.mass = 0.5;
        this.restitution = 0.9;
        this.baseSize = 1 + Math.random();
        this.hue = 60; // Yellow
        break;
      case 'matter':
        this.mass = 2;
        this.restitution = 0.7;
        this.baseSize = 2 + Math.random();
        this.hue = 200; // Blue
        break;
      case 'electric':
      case 'electron':
        this.mass = 0.3;
        this.restitution = 0.95;
        this.baseSize = 1.2;
        this.hue = 180; // Cyan
        break;
      case 'nuclear':
      case 'supernova':
        this.mass = 10;
        this.restitution = 0.4;
        this.baseSize = 4;
        this.hue = 30; // Orange
        break;
      case 'cosmic':
      case 'cosmic-ray':
        this.mass = 1;
        this.restitution = 0.8;
        this.baseSize = 2;
        this.hue = 280; // Purple
        break;
      case 'universal':
      case 'black-hole':
        this.mass = 20;
        this.restitution = 0.3;
        this.baseSize = 6;
        this.hue = 340; // Pink/Red
        break;
      case 'light-atom':
      case 'photon':
      case 'light':
        this.mass = 0.1;
        this.restitution = 0.99;
        this.baseSize = 1.5;
        this.hue = 60; // Light Yellow
        break;
      case 'heavy-atom':
      case 'proton':
        this.mass = 18;
        this.restitution = 0.5;
        this.baseSize = 5.5;
        this.hue = 210; // Deep Blue
        break;
      case 'neutral':
      case 'neutron':
        this.mass = 1.5;
        this.restitution = 0.6;
        this.baseSize = 1.8;
        this.hue = 0; // Gray
        break;
      case 'dark-matter':
      case 'darkness':
        this.mass = 50;
        this.restitution = 0.1;
        this.baseSize = 3;
        this.hue = 260; // Deep Indigo
        break;
      case 'quark':
        this.mass = 0.1;
        this.restitution = 0.98;
        this.baseSize = 1;
        this.hue = Math.random() * 360;
        break;
      case 'fire':
      case 'thermal':
      case 'solar':
        this.mass = 0.4;
        this.restitution = 0.8;
        this.baseSize = 2.5;
        this.hue = 15; // Red-Orange
        break;
      case 'water':
      case 'ice':
      case 'lunar':
        this.mass = 1.2;
        this.restitution = 0.6;
        this.baseSize = 2.2;
        this.hue = 200; // Sky Blue
        break;
      case 'wind':
      case 'sound-wave':
      case 'neutrino':
        this.mass = 0.2;
        this.restitution = 0.9;
        this.baseSize = 1.5;
        this.hue = 160; // Mint
        break;
      case 'earth':
      case 'pressure':
      case 'crystal':
        this.mass = 5;
        this.restitution = 0.3;
        this.baseSize = 3.5;
        this.hue = 40; // Brown/Gold
        break;
      case 'lightning':
      case 'plasma':
      case 'ion':
        this.mass = 0.3;
        this.restitution = 0.95;
        this.baseSize = 1.8;
        this.hue = 280; // Violet
        break;
      case 'magnetic':
      case 'liquid-metal':
        this.mass = 8;
        this.restitution = 0.5;
        this.baseSize = 3;
        this.hue = 220; // Steel Blue
        break;
      case 'gravity':
      case 'stellar':
        this.mass = 15;
        this.restitution = 0.2;
        this.baseSize = 5;
        this.hue = 50; // Golden
        break;
      case 'shockwave':
      case 'radiation':
      case 'toxic-gas':
        this.mass = 0.8;
        this.restitution = 0.7;
        this.baseSize = 2.8;
        this.hue = 100; // Lime/Toxic Green
        break;
      case 'nebula':
      case 'quantum-matter':
      case 'psionic':
        this.mass = 0.5;
        this.restitution = 0.85;
        this.baseSize = 3;
        this.hue = 300; // Magenta
        break;
      case 'bio-energy':
      case 'mutating-matter':
        this.mass = 2.5;
        this.restitution = 0.65;
        this.baseSize = 2.8;
        this.hue = 120; // Green
        break;
      case 'antimatter':
        this.mass = 1;
        this.restitution = 1.0;
        this.baseSize = 2;
        this.hue = 0; // Bright Red
        break;
      default:
        this.mass = 1;
        this.restitution = 0.8;
        this.baseSize = 2;
        this.hue = 200;
    }
    this.size = this.baseSize;
    this.updateColor();
  }

  updateColor() {
    const l = this.type === 'energy' || this.type === 'electric' || this.type === 'quark' ? 80 : 60;
    const s = this.type === 'neutral' ? 0 : (this.type === 'dark-matter' ? 30 : 100);
    const alpha = this.type === 'dark-matter' ? 0.2 + this.energy * 0.3 : 0.3 + this.energy * 0.7;
    this.color = `hsla(${this.hue}, ${s}%, ${l}%, ${alpha})`;
    // Size scales proportionally to energy level
    this.size = this.baseSize + this.energy * 8;
  }

  update(width: number, height: number, forces: Force[], config: any, modes: SimulationMode[], collisionEffects?: CollisionEffect[]) {
    const behavior = this.behavior;
    let friction = behavior.inertia - (this.mass * 0.0005);
    friction = Math.max(0.9, Math.min(0.9995, friction));
    
    if (modes.includes('static')) friction = Math.min(friction, 0.88);
    if (modes.includes('vortex')) friction = Math.min(0.9995, friction + 0.01);
    if (modes.includes('quantum')) friction = Math.min(0.9998, friction + 0.012); // Less friction in quantum world

    this.vx *= friction;
    this.vy *= friction;

    // Mode specific behaviors
    modes.forEach(mode => {
      switch (mode) {
        case 'chaos':
          if (Math.random() < 0.05) {
            this.vx += (Math.random() - 0.5) * 3;
            this.vy += (Math.random() - 0.5) * 3;
            this.energy = Math.min(1, this.energy + 0.2);
          }
          break;
        case 'aggregation':
          const dxCenter = width / 2 - this.x;
          const dyCenter = height / 2 - this.y;
          const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
          this.vx += (dxCenter / distCenter) * 0.1 * config.aggregationLevel;
          this.vy += (dyCenter / distCenter) * 0.1 * config.aggregationLevel;
          break;
        case 'explosion':
          const dxE = this.x - width / 2;
          const dyE = this.y - height / 2;
          const distE = Math.sqrt(dxE * dxE + dyE * dyE) || 1;
          this.vx += (dxE / distE) * 0.5 * config.explosionLevel;
          this.vy += (dyE / distE) * 0.5 * config.explosionLevel;
          break;
        case 'transformation':
          if (Math.random() < config.stateChangeRate * 0.1) {
            this.type = this.getRandomType();
            this.initTypeProps();
          }
          break;
        case 'vortex':
          const dxV = width / 2 - this.x;
          const dyV = height / 2 - this.y;
          const distV = Math.sqrt(dxV * dxV + dyV * dyV) || 1;
          this.vx += (dyV / distV) * 0.2 * config.vortexLevel;
          this.vy -= (dxV / distV) * 0.2 * config.vortexLevel;
          break;
        case 'neural-network':
          this.vx *= 0.95;
          this.vy *= 0.95;
          break;
        case 'black-hole':
          const dxBH = width / 2 - this.x;
          const dyBH = height / 2 - this.y;
          const distBH = Math.sqrt(dxBH * dxBH + dyBH * dyBH) || 1;
          const pullBH = Math.max(0.1, 1000 / (distBH + 100));
          this.vx += (dxBH / distBH) * pullBH;
          this.vy += (dyBH / distBH) * pullBH;
          break;
        case 'supernova':
          const dxSN = this.x - width / 2;
          const dySN = this.y - height / 2;
          const distSN = Math.sqrt(dxSN * dxSN + dySN * dySN) || 1;
          const pushSN = Math.max(0.1, 5000 / (distSN + 100));
          this.vx += (dxSN / distSN) * pushSN;
          this.vy += (dySN / distSN) * pushSN;
          this.energy = Math.min(1, this.energy + 0.05);
          break;
        case 'nebula':
          this.vx += Math.sin(this.y * 0.005 + Date.now() * 0.001) * 0.1;
          this.vy += Math.cos(this.x * 0.005 + Date.now() * 0.001) * 0.1;
          break;
        case 'galaxy':
          const dxG = width / 2 - this.x;
          const dyG = height / 2 - this.y;
          const distG = Math.sqrt(dxG * dxG + dyG * dyG) || 1;
          this.vx += (dyG / distG) * 0.5;
          this.vy -= (dxG / distG) * 0.5;
          this.vx += (dxG / distG) * 0.05;
          this.vy += (dyG / distG) * 0.05;
          break;
        case 'wormhole':
          const dxWH = width / 2 - this.x;
          const dyWH = height / 2 - this.y;
          const distWH = Math.sqrt(dxWH * dxWH + dyWH * dyWH) || 1;
          if (distWH < 50) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx *= 0.5;
            this.vy *= 0.5;
          } else {
            this.vx += (dxWH / distWH) * 0.8;
            this.vy += (dyWH / distWH) * 0.8;
          }
          break;
        case 'pulsar':
          const dxP = width / 2 - this.x;
          const dyP = height / 2 - this.y;
          const distP = Math.sqrt(dxP * dxP + dyP * dyP) || 1;
          const pulse = Math.sin(Date.now() * 0.005) * 2;
          this.vx += (dxP / distP) * pulse;
          this.vy += (dyP / distP) * pulse;
          break;
        case 'dark-energy':
          const dxDE = this.x - width / 2;
          const dyDE = this.y - height / 2;
          const distDE = Math.sqrt(dxDE * dxDE + dyDE * dyDE) || 1;
          this.vx += (dxDE / distDE) * 0.2;
          this.vy += (dyDE / distDE) * 0.2;
          break;
      }
    });

    // Intrinsic material behaviour: these forces are always active, even when
    // the user switches global simulation modes.
    const time = Date.now() * 0.001;
    const fieldCenterX = width / 2;
    const fieldCenterY = height / 2;
    const toCenterX = fieldCenterX - this.x;
    const toCenterY = fieldCenterY - this.y;
    const distanceFromCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY) || 1;
    const directionX = toCenterX / distanceFromCenter;
    const directionY = toCenterY / distanceFromCenter;
    const tangentX = -directionY;
    const tangentY = directionX;

    if (behavior.centerPull !== 0) {
      this.vx += directionX * behavior.centerPull;
      this.vy += directionY * behavior.centerPull;
    }
    if (behavior.radialDrive !== 0) {
      const radialImpulse = behavior.radialDrive * (0.35 + this.energy * 0.65);
      this.vx -= directionX * radialImpulse;
      this.vy -= directionY * radialImpulse;
    }
    if (behavior.orbitDrive !== 0) {
      this.vx += tangentX * behavior.orbitDrive;
      this.vy += tangentY * behavior.orbitDrive;
    }
    if (behavior.turbulence > 0) {
      const waveX = Math.sin(time * (1.5 + behavior.pulseSpeed * 4) + this.pulse);
      const waveY = Math.cos(time * (1.2 + behavior.pulseSpeed * 3) - this.pulse * 0.7);
      const randomJitter = behavior.turbulence * 0.12;
      this.vx += waveX * behavior.turbulence * 0.08 + (Math.random() - 0.5) * randomJitter;
      this.vy += waveY * behavior.turbulence * 0.08 + (Math.random() - 0.5) * randomJitter;
    }

    if (behavior.energyDrift !== 0) {
      this.energy = Math.min(1, Math.max(0.1, this.energy + behavior.energyDrift * (0.5 + this.energy)));
    }

    // Quantum Mode Behaviors
    if (modes.includes('quantum')) {
      // Phase evolution
      this.quantumState.phase += 0.05 * (this.quantumState.energyLevel + 1);
      
      // Coherence decay
      this.quantumState.coherence *= 0.9995;
      
      // Trigger decoherence effect if coherence falls below threshold
      if (this.quantumState.coherence < 0.2 && !this.quantumState.isCollapsed) {
        if (collisionEffects) {
          collisionEffects.push(new CollisionEffect(this.x, this.y, 'decoherence', this.color, config.highDefinition));
        }
        this.quantumState.isCollapsed = true;
        this.energy *= 0.8; // Energy loss during decoherence
      }
      
      // Probability cloud fluctuation
      if (!this.quantumState.isCollapsed) {
        this.quantumState.probabilityCloud = 0.5 + Math.sin(Date.now() * 0.001 + this.pulse) * 0.5;
        
        // Quantum Tunneling
        if (Math.random() < 0.001 * (1 - this.quantumState.coherence)) {
          this.x += (Math.random() - 0.5) * 200;
          this.y += (Math.random() - 0.5) * 200;
          if (collisionEffects) {
            collisionEffects.push(new CollisionEffect(this.x, this.y, 'transfer', '#00ffff', config.highDefinition));
          }
        }

        // Excitation / Emission
        if (this.energy > 0.92 && Math.random() < 0.02) {
          if (collisionEffects) {
            collisionEffects.push(new CollisionEffect(this.x, this.y, 'emission', this.color, config.highDefinition));
          }
          this.energy *= 0.6; // Lose energy on emission
        }
      }

      // Entanglement effects
      if (this.quantumState.entangledWith) {
        // If entangled, share some velocity or energy
        // (Logic handled in main loop for pairs)
      }
    }

    // Apply forces
    this.isSoundWaveInfluenced = false;
    forces.forEach(f => {
      const dx = f.x - this.x;
      const dy = f.y - this.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
              const effectiveRadius = f.radius * config.forceRadiusMult * behavior.interactionRadius;

      if (dist < effectiveRadius) {
        // Dark matter is highly resistant to most forces except universal, cosmic, and attractor
        let forceMult = 1.0;
        if (this.type === 'dark-matter') {
          const isGravityForce = f.type === 'universal' || f.type === 'cosmic' || f.type === 'attractor' || f.type === 'dark-matter';
          forceMult = isGravityForce ? 2.5 : 0; // Strictly only affected by gravity-like forces
        }

        const forceMag = (1 - dist / effectiveRadius) * f.strength * config.forceStrengthMult * forceMult * behavior.forceResponse / this.mass;
        
        switch (f.type) {
          case 'attractor':
          case 'atomic':
            this.vx += (dx / dist) * forceMag * 0.15;
            this.vy += (dy / dist) * forceMag * 0.15;
            this.energy = Math.min(1, this.energy + 0.02);
            break;
          case 'repulsor':
          case 'nuclear':
            this.vx -= (dx / dist) * forceMag * 0.25;
            this.vy -= (dy / dist) * forceMag * 0.25;
            this.energy = Math.min(1, this.energy + 0.03);
            break;
          case 'vortex':
          case 'universal':
            this.vx += (dy / dist) * forceMag * 0.2;
            this.vy -= (dx / dist) * forceMag * 0.2;
            this.vx += (dx / dist) * forceMag * 0.05;
            this.vy += (dy / dist) * forceMag * 0.05;
            break;
          case 'dispersion':
          case 'electric':
            this.vx -= (dx / dist) * forceMag * 0.6;
            this.vy -= (dy / dist) * forceMag * 0.6;
            this.energy = Math.min(1, this.energy + 0.08);
            break;
          case 'field':
            this.vx += Math.sin(this.y * 0.01) * forceMag;
            this.vy += Math.cos(this.x * 0.01) * forceMag;
            break;
          case 'transform':
            if (Math.random() < 0.1) {
               this.type = 'energy';
               this.initTypeProps();
            }
            break;
          case 'dark-matter':
            // Subtle but deep gravitational pull
            this.vx += (dx / dist) * forceMag * 0.05;
            this.vy += (dy / dist) * forceMag * 0.05;
            break;
          case 'antimatter':
            this.vx -= (dx / dist) * forceMag * 0.8;
            this.vy -= (dy / dist) * forceMag * 0.8;
            this.energy = Math.min(1, this.energy + 0.15);
            break;
          case 'plasma':
            this.vx += (dx / dist) * forceMag * 0.3;
            this.vy += (dy / dist) * forceMag * 0.3;
            this.vx += (Math.random() - 0.5) * forceMag * 0.5;
            this.vy += (Math.random() - 0.5) * forceMag * 0.5;
            break;
          case 'void':
            this.vx += (dx / dist) * forceMag * 0.1;
            this.vy += (dy / dist) * forceMag * 0.1;
            this.energy *= 0.95;
            break;
          case 'gravity-wave':
            const wave = Math.sin(dist * 0.05 - Date.now() * 0.01);
            this.vx += (dx / dist) * forceMag * wave * 0.5;
            this.vy += (dy / dist) * forceMag * wave * 0.5;
            break;
          case 'photon':
            this.vx += (dx / dist) * forceMag * 2.0;
            this.vy += (dy / dist) * forceMag * 2.0;
            this.energy = Math.min(1, this.energy + 0.1);
            break;
          case 'sound-wave':
            this.isSoundWaveInfluenced = true;
            const vibrate = Math.sin(dist * 0.1 - Date.now() * 0.05) * forceMag * 2;
            this.vx += (dx / dist) * vibrate;
            this.vy += (dy / dist) * vibrate;
            break;
        }
      }
    });

    if (config.enableCollisions) {
      this.energy *= 0.99;
      if (this.energy < 0.1) this.energy = 0.1;
    }

    this.pulse += behavior.pulseSpeed + this.energy * 0.1; // Intrinsic pulse speed

    // Quarks constantly change phase and colour; mutating matter changes its
    // visual phase more slowly so the two materials remain distinguishable.
    if (this.type === 'quark') {
      this.vx += (Math.random() - 0.5) * behavior.turbulence * 2.5;
      this.vy += (Math.random() - 0.5) * behavior.turbulence * 2.5;
      this.hue = (this.hue + 5) % 360;
    } else if (this.type === 'mutating-matter') {
      this.hue = (this.hue + Math.sin(time * 2) * 0.8) % 360;
    }

    // Keep material-specific behaviours expressive without allowing a single
    // high-energy particle to destabilise the whole canvas.
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > behavior.maxSpeed) {
      const speedScale = behavior.maxSpeed / speed;
      this.vx *= speedScale;
      this.vy *= speedScale;
    }

    this.x += this.vx * config.speedMult;
    this.y += this.vy * config.speedMult;

    this.size = this.baseSize + this.energy * 8; // Increased scaling
    this.updateColor();

    // Simulation Boundary (Open Space)
    const centerX = width / 2;
    const centerY = height / 2;
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Particles flow out and disappear when very far away
    const maxRadius = Math.max(width, height) * 2.5; 

    if (dist > maxRadius) {
      // Respawn at center with low velocity
      this.x = centerX + (Math.random() - 0.5) * 50;
      this.y = centerY + (Math.random() - 0.5) * 50;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = (Math.random() - 0.5) * 3;
      this.energy = 0.4;
      
      if (collisionEffects) {
        collisionEffects.push(new CollisionEffect(this.x, this.y, 'transfer', this.color, config.highDefinition));
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, config: any, modes: SimulationMode[] = [], quantumSettings: any = {}) {
    const behavior = this.behavior;
    const twinkle = Math.sin(this.pulse) * 0.3 + 0.7;
    const glowIntensity = config.glowLevel * this.energy * twinkle;
    
    // Excitation Glow
    if (this.energy > 0.85) {
      ctx.save();
      ctx.shadowBlur = 25 * this.energy;
      ctx.shadowColor = this.color;
      ctx.globalAlpha = Math.min(1, (this.energy - 0.85) * 4);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

    // Intrinsic behaviour signature. The same global mode can now show
    // different motion language for different materials.
    const motionSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (behavior.trailFactor > 0.1 && motionSpeed > 0.6) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(0.42, behavior.trailFactor * (0.12 + this.energy * 0.25));
      ctx.strokeStyle = this.color;
      ctx.lineWidth = Math.max(0.6, this.size * 0.16);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * (2 + behavior.trailFactor * 5), this.y - this.vy * (2 + behavior.trailFactor * 5));
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(0.55, 0.16 + this.energy * 0.32);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = Math.max(0.7, this.size * 0.14);
    switch (behavior.motion) {
      case 'radiant': {
        const rayLength = this.size * (2.5 + this.energy * 3);
        for (let i = 0; i < 4; i++) {
          const angle = this.pulse * 0.35 + (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(this.x + Math.cos(angle) * this.size, this.y + Math.sin(angle) * this.size);
          ctx.lineTo(this.x + Math.cos(angle) * rayLength, this.y + Math.sin(angle) * rayLength);
          ctx.stroke();
        }
        break;
      }
      case 'wave': {
        for (let i = 1; i <= 2; i++) {
          const radius = this.size * (2 + i * 2) + ((this.pulse * 8 + i * 10) % 12);
          ctx.globalAlpha *= 0.65;
          ctx.beginPath();
          ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      }
      case 'orbital': {
        ctx.globalAlpha *= 0.7;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.pulse * 0.15);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 3.4, this.size * 1.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case 'anchored': {
        ctx.globalAlpha *= 0.65;
        ctx.beginPath();
        ctx.rect(this.x - this.size * 1.5, this.y - this.size * 1.5, this.size * 3, this.size * 3);
        ctx.stroke();
        break;
      }
      case 'turbulent': {
        for (let i = 0; i < 3; i++) {
          const angle = this.pulse * (1 + i * 0.35) + i * 2;
          const length = this.size * (1.8 + i * 0.8);
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + Math.cos(angle) * length, this.y + Math.sin(angle) * length);
          ctx.stroke();
        }
        break;
      }
      case 'attractor': {
        ctx.globalAlpha *= 0.7;
        for (let i = 0; i < 2; i++) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * (2 + i * 1.8), this.pulse + i, this.pulse + Math.PI * 1.35 + i);
          ctx.stroke();
        }
        break;
      }
      case 'quantum': {
        ctx.globalAlpha *= 0.75 * this.quantumState.coherence;
        const quantumRadius = this.size * (2 + this.quantumState.probabilityCloud * 2);
        ctx.beginPath();
        ctx.arc(this.x, this.y, quantumRadius, this.quantumState.phase, this.quantumState.phase + Math.PI * 1.4);
        ctx.stroke();
        break;
      }
      case 'fluid': {
        ctx.globalAlpha *= 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.4 + Math.sin(this.pulse) * this.size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
    }
    ctx.restore();

    // Quantum Visualization
    if (modes.includes('quantum')) {
      const { isQuantumEnergyView, showProbabilityCloud, isWaveMode } = quantumSettings;

      if (showProbabilityCloud && !this.quantumState.isCollapsed) {
        ctx.save();
        const cloudAlpha = 0.15 * this.quantumState.probabilityCloud * this.quantumState.coherence;
        ctx.globalAlpha = cloudAlpha;
        
        // Probability cloud with gradient
        const cloudGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 8);
        cloudGrad.addColorStop(0, this.color);
        cloudGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cloudGrad;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (isWaveMode && !this.quantumState.isCollapsed) {
        // Wave interference pattern visualization
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const waveCount = 3;
        for (let i = 0; i < waveCount; i++) {
          const r = this.size * (3 + i * 4);
          const alpha = (0.2 / (i + 1)) * this.quantumState.coherence;
          ctx.strokeStyle = this.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          
          // Draw wave ring with interference "ripples"
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 2; a += 0.1) {
            const ripple = Math.sin(a * 8 + this.quantumState.phase + i) * 2;
            const rx = this.x + Math.cos(a) * (r + ripple);
            const ry = this.y + Math.sin(a) * (r + ripple);
            if (a === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
        
        // If in wave mode, the "particle" itself is more ethereal
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        return; // Skip standard drawing if in pure wave mode
      }

      if (isQuantumEnergyView) {
        // Energy rings
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < this.quantumState.energyLevel + 1; i++) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * (1.5 + i * 0.8), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      if (isWaveMode) {
        // Wave interference pattern
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        const waveCount = 4;
        for (let i = 0; i < waveCount; i++) {
          const r = this.size * 2 + Math.sin(Date.now() * 0.01 + i) * 5;
          ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    // Only draw glow if energy is high enough to be visible
    if (glowIntensity > 0.1) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      const alpha = Math.min(0.5, glowIntensity * 0.2);
      
      // Outer soft glow
      const outerGlowRadius = this.size * (2.0 + glowIntensity * 3.0);
      if (Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.size) && Number.isFinite(outerGlowRadius) && outerGlowRadius > 0) {
        const outerGradient = ctx.createRadialGradient(this.x, this.y, this.size, this.x, this.y, outerGlowRadius);
        outerGradient.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${alpha * 0.6})`);
        outerGradient.addColorStop(1, `hsla(${this.hue}, 100%, 40%, 0)`);
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, outerGlowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner intense glow for high energy
      if (glowIntensity > 1.2) {
        const innerGlowRadius = this.size * (1.2 + glowIntensity * 0.5);
        if (Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(innerGlowRadius) && innerGlowRadius > 0) {
          const innerGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, innerGlowRadius);
          innerGradient.addColorStop(0, `hsla(${this.hue}, 100%, 90%, ${alpha})`);
          innerGradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 70%, ${alpha * 0.5})`);
          innerGradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
          ctx.fillStyle = innerGradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, innerGlowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Type-specific effects (Simplified)
      if (this.energy > 0.6) {
        switch (this.type) {
          case 'electric':
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 90%, ${alpha * 1.5})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            const angle = this.pulse;
            const len = this.size * 3;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(angle) * len, this.y + Math.sin(angle) * len);
            ctx.stroke();
            break;
          case 'nuclear':
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha * 0.2})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'dark-matter':
            ctx.strokeStyle = `hsla(260, 100%, 40%, ${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }
      }
      ctx.restore();
    }

    // Core particle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Sound Wave Visualization: Concentric Rings
    if (this.isSoundWaveInfluenced) {
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const r = this.size + ((Date.now() * 0.05 + i * 10) % 30);
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Quantum Spin & Phase Indicator
    if (modes.includes('quantum')) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.quantumState.phase);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -this.size * 1.5);
      ctx.stroke();
      
      // Spin direction arrow
      ctx.fillStyle = '#ffffff';
      const arrowSize = 3;
      if (this.quantumState.spin > 0) {
        ctx.beginPath();
        ctx.moveTo(-arrowSize, -this.size * 1.5);
        ctx.lineTo(arrowSize, -this.size * 1.5);
        ctx.lineTo(0, -this.size * 1.5 - arrowSize);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(-arrowSize, -this.size * 1.5);
        ctx.lineTo(arrowSize, -this.size * 1.5);
        ctx.lineTo(0, -this.size * 1.5 + arrowSize);
        ctx.fill();
      }
      ctx.restore();
    }
    
    // Bright center for very high energy
    if (this.energy > 0.85) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
