/**
 * A worked solution attached to a maths question or lesson example.
 * It stores only the numbers; the layout and the step-by-step explanation are
 * calculated from them (src/lib/working.ts), so the working can never disagree
 * with the question.
 */
export type Working =
  /** Column addition or subtraction, with carrying / regrouping marks. `decimals` places a decimal point. */
  | { kind: "column"; op: "+" | "−"; top: number; bottom: number; decimals?: number; unit?: string }
  /** Long multiplication: a × b with partial products. */
  | { kind: "long-multiplication"; a: number; b: number }
  /** Long division laid out the way Kenyan textbooks do it. */
  | { kind: "long-division"; dividend: number; divisor: number }
  /** Multiplication as equal groups / repeated addition (lower primary). */
  | { kind: "groups"; groups: number; each: number }
  /** Division as sharing into equal groups / repeated subtraction (lower primary). */
  | { kind: "sharing"; total: number; groups: number }
  /** A place value chart for a whole number, optionally highlighting one place (0 = ones). */
  | { kind: "place-value"; value: number; place?: number }
  /** Adding or subtracting fractions or mixed numbers using the LCM, e.g. a: "1 1/2". */
  | { kind: "fraction"; op: "+" | "−"; a: string; b: string };
