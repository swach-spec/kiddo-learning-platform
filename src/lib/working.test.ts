import { describe, expect, it } from "vitest";
import { columnWorking, fractionWorking, groupsWorking, longDivision, longMultiplication, placeValueWorking, sharingWorking } from "@/lib/working";

const cellsToNumber = (cells: (number | string | null)[]) => Number(cells.map((c) => c ?? "").join(""));

describe("column working", () => {
  it("adds with carrying and marks the carry", () => {
    const w = columnWorking("+", 247, 35);
    expect(w.answer).toBe("282");
    expect(cellsToNumber(w.result)).toBe(282);
    expect(w.marks).toEqual([null, "1", null]);
    expect(w.steps[0].text).toMatch(/Ones: 7 \+ 5 = 12\. Write 2 and carry 1 to the tens/);
  });

  it("subtracts with regrouping and crosses out the lender", () => {
    const w = columnWorking("−", 352, 27);
    expect(w.answer).toBe("325");
    expect(w.crossed).toEqual([false, true, true]);
    expect(w.marks).toEqual([null, "4", "12"]);
  });

  it("regroups across a zero (zeros become 9)", () => {
    const w = columnWorking("−", 900, 245);
    expect(w.answer).toBe("655");
    expect(w.marks).toEqual(["8", "9", "10"]);
    expect(w.steps[0].text).toMatch(/zeros on the way become 9/);
  });

  it("handles decimals by lining up the point", () => {
    const w = columnWorking("+", 4250, 1375, 3);
    expect(w.answer).toBe("5.625");
    expect(w.steps[0].text).toMatch(/^Thousandths/);
  });

  it("checks every sum and difference used by the Grade 3 bank shape", () => {
    for (const [a, b] of [[318, 47], [457, 328], [609, 84], [653, 218], [830, 214], [745, 38]]) {
      expect(cellsToNumber(columnWorking("+", a, b).result)).toBe(a + b);
      expect(cellsToNumber(columnWorking("−", a, b).result)).toBe(a - b);
    }
  });
});

describe("long multiplication", () => {
  it("shows partial products and the total", () => {
    const w = longMultiplication(2345, 23);
    expect(w.answer).toBe("53,935");
    expect(w.rows.map((r) => r.cells.join("").trim())).toEqual(["2345", "×23", "7035", "46900", "53935"]);
  });
});

describe("long division", () => {
  it("lays out each divide / multiply / subtract / bring-down step", () => {
    const w = longDivision(125, 5);
    expect(w.quotient).toBe(25);
    expect(w.remainder).toBe(0);
    expect(w.quotientCells).toEqual([null, "2", "5"]);
    expect(w.rows.map((r) => r.text)).toEqual(["10", "25", "25", "0"]);
    expect(w.steps[0].text).toMatch(/1 is smaller than 5, so start with the first 2 digits: 12/);
  });

  it("writes zeros in the quotient and reports remainders", () => {
    const w = longDivision(8432, 4);
    expect(w.quotient).toBe(2108);
    expect(w.quotientCells.join("")).toBe("2108");
    const r = longDivision(1000, 7);
    expect(r.quotient).toBe(142);
    expect(r.remainder).toBe(6);
    expect(r.steps.at(-1)!.text).toMatch(/remainder 6/);
  });

  it("works for 2-digit divisors", () => {
    const w = longDivision(7392, 24);
    expect(w.quotient).toBe(308);
    expect(w.remainder).toBe(0);
  });
});

describe("lower primary pictures", () => {
  it("groups and sharing", () => {
    expect(groupsWorking(4, 5).total).toBe(20);
    expect(groupsWorking(4, 5).steps[1].text).toContain("5 + 5 + 5 + 5 = 20");
    expect(sharingWorking(20, 4).each).toBe(5);
  });
});

describe("place value and fractions", () => {
  it("place value chart", () => {
    const w = placeValueWorking(4708216, 6);
    expect(w.columns[0]).toMatchObject({ digit: 4, name: "millions", value: 4000000 });
    expect(w.steps.at(-1)!.text).toBe("Its value is 4 × 1,000,000 = 4,000,000.");
  });

  it("fractions with the LCM and mixed numbers", () => {
    expect(fractionWorking("+", "1/4", "1/6").answer).toBe("5/12");
    expect(fractionWorking("+", "2 2/3", "1 3/4").answer).toBe("4 5/12");
    expect(fractionWorking("−", "4 1/6", "2 3/4").answer).toBe("1 5/12");
    expect(fractionWorking("+", "1/4", "1/6").steps[0].text).toContain("The LCM is 12");
  });
});
