"use client";

import { useCallback, useEffect, useState } from "react";
import { Player } from "@/lib/kiddo";
import * as playerStore from "@/lib/player";

/**
 * Client-side hook for the currently selected player. Wraps
 * lib/player.ts so components never call localStorage directly.
 *
 * `loading` is true only until the initial client-side read completes
 * (avoids a hydration mismatch, since localStorage isn't available
 * during server rendering).
 */
export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPlayer(playerStore.getCurrentPlayer());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setPlayer(playerStore.getCurrentPlayer());
  }, []);

  const awardXP = useCallback((amount: number) => {
    setPlayer((current) => {
      if (!current) return current;
      return playerStore.awardXP(current.id, amount) ?? current;
    });
  }, []);

  const markStoryCompleted = useCallback((storyId: string) => {
    setPlayer((current) => {
      if (!current) return current;
      return playerStore.markStoryCompleted(current.id, storyId) ?? current;
    });
  }, []);

  return { player, loading, refresh, awardXP, markStoryCompleted };
}
