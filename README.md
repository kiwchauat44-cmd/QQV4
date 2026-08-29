<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6136f385-f8cd-4921-a567-ab917591ac6f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Intrinsic Particle Behaviours

QQV4 now gives each energy and matter type an intrinsic behaviour profile in `src/types.ts`. The profile controls inertia, maximum speed, response to external fields, attraction or radial drive, turbulence, energy drift, pulse speed, collision reactivity, and the visual signature drawn around the particle.

Examples include:

- **Fire, plasma, lightning, and quark** use turbulent or radiant motion with stronger trails and energy response.
- **Water, nebula, liquid-metal, and bio-energy** use fluid motion with softer drift and local aggregation.
- **Earth, ice, crystal, heavy-atom, and matter** use anchored motion with high inertia and restrained trails.
- **Photon, light, radiation, and cosmic-ray** use radiant motion with high speed and directional rays.
- **Gravity, dark-matter, darkness, black-hole, and universal** use attractor motion with stronger central pull.
- **Electron, magnetic, cosmic, stellar, and lunar** use orbital motion.
- **Neutrino, wind, sound-wave, boson, and light-atom** use wave motion with visible propagation rings.

Hover an energy type in the bottom selector to see its behaviour label, motion signature, and property description. Collision effects also adapt to the participating profiles, producing sparks, interference, entanglement, explosions, or shockwaves according to the materials involved.

Run the focused smoke test with:

```bash
npm run test:behavior
```
