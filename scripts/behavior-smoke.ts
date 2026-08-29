import { Particle, getParticleBehaviorProfile, type ParticleType } from '../src/types';

const types: ParticleType[] = [
  'energy', 'matter', 'light-atom', 'heavy-atom', 'neutral', 'electric',
  'nuclear', 'cosmic', 'universal', 'dark-matter', 'quark', 'planet-core',
  'antimatter', 'plasma', 'photon', 'fire', 'water', 'wind', 'earth',
  'light', 'darkness', 'lightning', 'ice', 'thermal', 'magnetic', 'sound-wave',
  'pressure', 'gravity', 'shockwave', 'electron', 'proton', 'neutron', 'ion',
  'neutrino', 'boson', 'stellar', 'solar', 'lunar', 'cosmic-ray', 'nebula',
  'black-hole', 'supernova', 'liquid-metal', 'crystal', 'toxic-gas', 'radiation',
  'quantum-matter', 'bio-energy', 'psionic', 'mutating-matter',
];

const config = {
  particleCount: 100,
  forceStrengthMult: 1,
  forceRadiusMult: 1,
  speedMult: 1,
  glowLevel: 2,
  trailLength: 0.15,
  enableCollisions: true,
  stateChangeRate: 0,
  aggregationLevel: 1,
  explosionLevel: 1,
  vortexLevel: 1,
  highDefinition: false,
};

const profiles = types.map(type => getParticleBehaviorProfile(type));
const motionKinds = new Set(profiles.map(profile => profile.motion));
if (motionKinds.size < 5) {
  throw new Error(`Expected at least five motion signatures, got ${motionKinds.size}`);
}

for (const type of types) {
  const particle = new Particle(800, 600, type);
  particle.x = 400;
  particle.y = 300;
  particle.vx = 2;
  particle.vy = -1;
  particle.update(800, 600, [], config, []);

  for (const value of [particle.x, particle.y, particle.vx, particle.vy, particle.energy, particle.size]) {
    if (!Number.isFinite(value)) {
      throw new Error(`${type} produced a non-finite value`);
    }
  }
  if (particle.behavior.label.length === 0 || particle.behavior.detail.length === 0) {
    throw new Error(`${type} is missing a behavior description`);
  }
}

console.log(`Behavior smoke test passed: ${types.length} types, ${motionKinds.size} motion signatures.`);
