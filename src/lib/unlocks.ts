import { unlocks } from "@/content/unlocks";
import { Unlock } from "@/types/unlock";

export function getAllUnlocks(): Unlock[] {
  return unlocks;
}

export function getUnlockById(id: string): Unlock | null {
  return unlocks.find((unlock) => unlock.id === id) ?? null;
}

export function isUnlockAvailable(
  unlock: Unlock,
  playerLevel: number
): boolean {
  return playerLevel >= unlock.requiredLevel;
}

export function getPlayerUnlocks(playerLevel: number) {
  return unlocks.map((unlock) => ({
    ...unlock,
    unlocked: isUnlockAvailable(unlock, playerLevel),
  }));
}

export function getUnlockedItems(playerLevel: number): Unlock[] {
  return unlocks.filter((unlock) =>
    isUnlockAvailable(unlock, playerLevel)
  );
}

export function getLockedItems(playerLevel: number): Unlock[] {
  return unlocks.filter(
    (unlock) => !isUnlockAvailable(unlock, playerLevel)
  );
}

export function getNextUnlock(playerLevel: number): Unlock | null {
  return (
    unlocks
      .filter((unlock) => unlock.requiredLevel > playerLevel)
      .sort((a, b) => a.requiredLevel - b.requiredLevel)[0] ?? null
  );
}