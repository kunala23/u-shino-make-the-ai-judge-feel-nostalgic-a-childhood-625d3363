// Entry for make.fun: "Make the AI Judge Feel Nostalgic: A Childhood Memory"
// Writes one sentence (<=280 chars) recalling a childhood memory to /output/entry.txt.
// Deterministic, no network, no secrets, no env vars.
//
// Revision (v2): instead of hardcoding one line, the program scores three
// candidate memories against the judge's five published criteria —
// (1) stirs nostalgia, (2) grounded in a concrete place/time/sensation,
// (3) sounds truly lived, small honest detail, (4) single clean sentence
// <=280 chars, every word earning its place, (5) leaves a warm ache that
// lingers — and writes the winner. Ties break toward the line whose final
// image lands the ache most directly.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = { text: string; scores: [number, number, number, number, number] };

const CANDIDATES: Candidate[] = [
  {
    // Grandmother's kitchen at dusk: fresh rice, woodsmoke, radio low.
    // Strong on every criterion; ends on "the whole house felt safe".
    text: "Every evening at dusk my grandmother called me in from the yard, and the kitchen smelled of fresh rice and woodsmoke while the radio crackled low and the whole house felt safe.",
    scores: [2, 2, 2, 2, 2], // 10/10
  },
  {
    // Night market on grandfather's shoulders: rain on hot pavement.
    // Vivid and honest, but the ache fades — it ends on the vendor's call
    // rather than on a feeling that lingers.
    text: "On summer evenings my grandfather lifted me onto his shoulders at the night market, and I can still smell rain on hot pavement and hear the vendor calling mangoes by the kilo.",
    scores: [2, 2, 2, 2, 1], // 9/10
  },
  {
    // Screen door squeak, steaming rice, slow ceiling fan.
    // Honest and concrete, but the closing line explains the ache instead
    // of letting the image carry it.
    text: "I still remember the exact squeak of the screen door at my grandmother's house, where the rice steamed, the ceiling fan turned slow, and nobody ever hurried me to grow up.",
    scores: [2, 2, 2, 2, 1], // 9/10
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((a, b) => a + b, 0);
}

function pickWinner(candidates: Candidate[]): string {
  let best = candidates[0];
  for (const c of candidates.slice(1)) {
    if (total(c) > total(best)) best = c;
  }
  return best.text;
}

function main(): void {
  const line = pickWinner(CANDIDATES);
  if (line.length < 1 || line.length > 280) {
    throw new Error(`entry must be 1-280 chars, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  let outDir = "/output";
  try {
    mkdirSync(outDir, { recursive: true });
  } catch {
    outDir = "./output";
    mkdirSync(outDir, { recursive: true });
  }
  writeFileSync(`${outDir}/entry.txt`, line, "utf8");
}

main();
