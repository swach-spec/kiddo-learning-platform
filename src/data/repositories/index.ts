import { KiddoRepositories } from "@/data/repositories/types";
import { localStorageRepositories } from "@/data/adapters/localStorage/localStorageRepository";

/**
 * Repository composition root.
 *
 * KIDDO currently uses LocalStorage. The rest of the application should
 * depend on this interface rather than importing a storage implementation.
 * A Supabase composition can replace this export without changing callers.
 */
export function getRepositories(): KiddoRepositories {
  return localStorageRepositories;
}

export type {
  ActivityRepository,
  AnalyticsEvent,
  AnalyticsRepository,
  KiddoRepositories,
  LearnerRepository,
  ProgressRepository,
  RevisionRepository,
} from "@/data/repositories/types";
