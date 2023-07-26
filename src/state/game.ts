let currentRoundNumber: number | null = null;
let currentRoundId: string | null = null;

export function getCurrentRoundNumber(): number | null {
  return currentRoundNumber;
}

export function getCurrentRoundId(): string | null {
  return currentRoundId;
}

export function set(roundNumber: number, roundId: string): void {
  currentRoundNumber = roundNumber;
  currentRoundId = roundId;
}
