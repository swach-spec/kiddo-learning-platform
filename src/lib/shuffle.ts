/**
 * Returns a new array with the same items in random order.
 * Fisher-Yates shuffle — does not mutate the input array.
 *
 * Used to randomize question order and answer-option order so a
 * learner can't just memorize "question 3 = B". Since correctness is
 * always checked by id (not position), shuffling is safe and never
 * breaks a question that depends on option order.
 */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
