import data from "./students.json";
import type { Mood, Tone } from "../notifications";

/* The Brokie student dataset: 40 students in Vilnius and Kaunas, three months of transactions each.
   Built by scripts/build-students.py from dataset.xlsx. The demo app runs on one of these students.
   Months: September and October are history, November is the month in progress (day 14 of 30). */

export type Cat = "housing" | "groceries" | "eatingOut" | "transport" | "subscriptions" | "fun" | "shopping" | "care";

/* Dataset categories grouped into what a student actually budgets for. "need" categories are never shamed. */
export const STUDENT_CATEGORIES: { id: Cat; label: string; color: string; raw: string[]; need: boolean }[] = [
  { id: "housing", label: "Rent & bills", color: "hsl(var(--chart-1))", raw: ["Rent", "Utilities"], need: true },
  { id: "groceries", label: "Groceries", color: "hsl(var(--chart-2))", raw: ["Groceries"], need: true },
  { id: "eatingOut", label: "Eating out & coffee", color: "hsl(var(--chart-3))", raw: ["Eating out", "Coffee"], need: false },
  { id: "transport", label: "Transport", color: "hsl(var(--chart-4))", raw: ["Transport pass", "Public transport", "Taxi / Bolt"], need: true },
  { id: "subscriptions", label: "Subscriptions & phone", color: "hsl(var(--chart-5))", raw: ["Subscriptions", "Phone plan"], need: false },
  { id: "fun", label: "Fun & sport", color: "hsl(var(--chart-6))", raw: ["Entertainment", "Sport", "Travel"], need: false },
  { id: "shopping", label: "Shopping & tech", color: "hsl(var(--chart-7))", raw: ["Shopping", "Tech", "Other"], need: false },
  { id: "care", label: "Study & health", color: "hsl(var(--primary-glow))", raw: ["Education", "Health"], need: true },
];

const CAT_OF: Record<string, Cat> = Object.fromEntries(STUDENT_CATEGORIES.flatMap((c) => c.raw.map((r) => [r, c.id])));
export const catMeta = (id: Cat) => STUDENT_CATEGORIES.find((c) => c.id === id)!;

export type Budget = Record<Cat, number>;

export const MONTHS = ["September", "October", "November"] as const;
export const CURRENT = { name: "November", today: 14, days: data.days };

/* Display names for the anonymised students (the dataset only has handles like student_001). */
const NAMES = [
  "Austėja", "Matas", "Gabija", "Lukas", "Emilija", "Jokūbas", "Ugnė", "Dominykas", "Kamilė", "Nojus",
  "Urtė", "Benas", "Goda", "Kajus", "Lėja", "Titas", "Miglė", "Ignas", "Smiltė", "Domantas",
  "Viltė", "Arnas", "Karolina", "Paulius", "Rugilė", "Mantas", "Eglė", "Tomas", "Justė", "Rokas",
  "Ieva", "Martynas", "Gintarė", "Aistis", "Simona", "Edvinas", "Monika", "Laurynas", "Greta", "Vakaris",
];

const UNI_SHORT: Record<string, string> = {
  "Vilnius University": "VU",
  "VILNIUS TECH": "VILNIUS TECH",
  "ISM University of Management and Economics": "ISM",
  "Mykolas Romeris University": "MRU",
  "Kaunas University of Technology": "KTU",
  "Vytautas Magnus University": "VMU",
  "Vilnius Academy of Arts": "VDA",
};

export type StudentTx = { id: number; month: number; day: number; raw: string; label: string; amount: number; cat: Cat | "income" };

type RawStudent = (typeof data.students)[number];

export type Student = Omit<RawStudent, "tx" | "tone" | "budgets"> & {
  name: string;
  uniShort: string;
  tone: Tone;
  budgets: Record<string, number>;
  tx: StudentTx[];
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const roundUp5 = (n: number) => Math.ceil(n / 5) * 5;
const round5 = (n: number) => Math.round(n / 5) * 5;

export const STUDENTS: Student[] = data.students.map((s, i) => ({
  ...s,
  name: NAMES[i % NAMES.length],
  uniShort: UNI_SHORT[s.university] ?? s.university,
  tone: s.tone === "savage" ? "savage" : "gentle",
  budgets: s.budgets as Record<string, number>,
  tx: s.tx.map(([month, day, rawIdx, cents, note], k) => {
    const raw = data.rawCategories[rawIdx as number];
    return {
      id: k + 1,
      month: month as number,
      day: day as number,
      raw,
      label: (note as string | undefined) ?? raw,
      amount: (cents as number) / 100,
      cat: CAT_OF[raw] ?? "income",
    };
  }),
}));

/* The student the demo opens with: positive balance, a shared flat, eating out as the habit to work on. */
export const FEATURED_ID = "U015";
export const studentById = (id: string) => STUDENTS.find((s) => s.id === id) ?? STUDENTS.find((s) => s.id === FEATURED_ID)!;

/* ---------- per-month numbers ---------- */

export type MonthStats = {
  name: string;
  income: number;
  spent: number;
  byCategory: (cat: Cat) => number;
  transactions: (cat: Cat) => StudentTx[];
  weekly: (cat: Cat) => number[];
  breakdown: (cat: Cat) => { raw: string; total: number; count: number }[];
};

const monthStats = (list: StudentTx[], name: string): MonthStats => {
  const spend = list.filter((t) => t.cat !== "income");
  const inCat = (cat: Cat) => spend.filter((t) => t.cat === cat);
  return {
    name,
    income: r2(list.filter((t) => t.cat === "income").reduce((s, t) => s + t.amount, 0)),
    spent: r2(spend.reduce((s, t) => s - t.amount, 0)),
    byCategory: (cat) => r2(inCat(cat).reduce((s, t) => s - t.amount, 0)),
    transactions: (cat) => [...inCat(cat)].sort((a, b) => b.day - a.day || b.id - a.id),
    weekly: (cat) => {
      const weeks = [0, 0, 0, 0];
      inCat(cat).forEach((t) => (weeks[Math.min(3, Math.floor((t.day - 1) / 7))] -= t.amount));
      return weeks.map(r2);
    },
    breakdown: (cat) =>
      catMeta(cat)
        .raw.map((raw) => {
          const rows = inCat(cat).filter((t) => t.raw === raw);
          return { raw, total: r2(rows.reduce((s, t) => s - t.amount, 0)), count: rows.length };
        })
        .filter((b) => b.count > 0)
        .sort((a, b) => b.total - a.total),
  };
};

/* ---------- dataset-wide averages, for "students like you" comparisons ---------- */

const avgMonthly = (s: Student, cat: Cat) => r2(s.tx.filter((t) => t.cat === cat && t.month < 2).reduce((sum, t) => sum - t.amount, 0) / 2);

export const cohortAverage = (cat: Cat, living?: string) => {
  const group = living ? STUDENTS.filter((s) => s.living === living) : STUDENTS;
  return Math.round(group.reduce((sum, s) => sum + avgMonthly(s, cat), 0) / group.length);
};

/* ---------- the model one student's app runs on ---------- */

export type Insight = { text: string; mood: Mood; total: number; count: number; share: number };

export type StudentModel = {
  student: Student;
  previous: MonthStats; // September
  history: MonthStats; // October, the month Brokie analyses
  current: MonthStats & { today: number; days: number }; // November so far
  income: number; // expected monthly income
  categories: Cat[]; // categories this student actually spends on
  fixed: Cat[];
  flexible: Cat[];
  focus: Cat; // the habit Brokie suggests working on
  ownBudget: (cat: Cat) => number | null; // limits the student set themselves in the dataset
  suggested: Budget;
  remaining: (b: Budget, cat: Cat) => number;
  projected: (b: Budget) => number;
  insight: (cat: Cat) => Insight;
};

const eur = (n: number) => `€${Math.abs(n).toFixed(2)}`;
const eur0 = (n: number) => `€${Math.round(Math.abs(n))}`;

const build = (s: Student): StudentModel => {
  const previous = monthStats(s.tx.filter((t) => t.month === 0), MONTHS[0]);
  const history = monthStats(s.tx.filter((t) => t.month === 1), MONTHS[1]);
  const current = { ...monthStats(s.tx.filter((t) => t.month === 2 && t.day <= CURRENT.today), MONTHS[2]), today: CURRENT.today, days: CURRENT.days };
  const avg = (cat: Cat) => r2((previous.byCategory(cat) + history.byCategory(cat)) / 2);

  const categories = STUDENT_CATEGORIES.map((c) => c.id).filter((id) => avg(id) > 0 || current.byCategory(id) > 0);
  const fixed = categories.filter((c) => c === "housing");
  const flexible = categories.filter((c) => c !== "housing");

  // The student's own limits; parts of a category without a limit count at what they usually spend
  const avgRaw = (raw: string) => r2(s.tx.filter((t) => t.raw === raw && t.month < 2).reduce((sum, t) => sum - t.amount, 0) / 2);
  const ownBudget = (cat: Cat) => {
    const raws = catMeta(cat).raw;
    if (!raws.some((r) => s.budgets[r] != null)) return null;
    return roundUp5(raws.reduce((sum, r) => sum + (s.budgets[r] ?? avgRaw(r)), 0));
  };

  // Focus: the "want" the student overspends most against their own limit; otherwise their biggest want
  const wants = flexible.filter((c) => !catMeta(c).need && c !== "subscriptions");
  const over = (c: Cat) => avg(c) - (ownBudget(c) ?? avg(c));
  const byOver = [...wants].sort((a, b) => over(b) - over(a));
  const focus = (over(byOver[0]) > 0 ? byOver[0] : [...wants].sort((a, b) => avg(b) - avg(a))[0]) ?? flexible[0];

  // Suggested plan: fixed costs as they are, the student's own limits where they set one, last two months elsewhere,
  // and the focus habit trimmed by about 15%.
  const suggested = Object.fromEntries(
    STUDENT_CATEGORIES.map(({ id }) => {
      if (id === "housing") return [id, Math.ceil(history.byCategory(id))];
      const usual = roundUp5(avg(id));
      const own = ownBudget(id);
      const base = own == null ? usual : catMeta(id).need ? Math.max(own, usual) : own;
      return [id, id === focus ? Math.max(5, Math.min(base, round5(avg(id) * 0.85))) : base];
    }),
  ) as Budget;

  const income = s.income.total;
  const remaining = (b: Budget, cat: Cat) => r2(b[cat] - current.byCategory(cat));
  const projected = (b: Budget) => r2(income - STUDENT_CATEGORIES.reduce((sum, c) => sum + Math.max(b[c.id], current.byCategory(c.id)), 0));

  const insight = (cat: Cat): Insight => {
    const total = history.byCategory(cat);
    if (!total) return { text: `Nothing on ${catMeta(cat).label.toLowerCase()} in October. Brokie noticed.`, mood: "proud", total: 0, count: 0, share: 0 };
    const count = history.transactions(cat).length;
    const share = history.spent ? Math.round((total / history.spent) * 100) : 0;
    const peers = cohortAverage(cat, s.living);
    const own = ownBudget(cat);
    const parts = history.breakdown(cat);
    const result = (text: string, mood: Mood) => ({ text, mood, total, count, share });
    const vsPeers = peers ? ` Students who also live ${s.living === "With parents" ? "with parents" : s.living === "Dorm" ? "in a dorm" : s.living === "Shared flat" ? "in a shared flat" : "alone or with a partner"} average ${eur0(peers)}.` : "";

    switch (cat) {
      case "housing":
        return result(`Rent and bills are ${share}% of everything you spent. They're fixed, so Brokie leaves them alone and works on the rest.`, "happy");
      case "groceries":
        return result(`${count} grocery runs in October, ${eur(total)} in total. Cooking at home is your cheapest habit. Keep it up.`, "proud");
      case "eatingOut": {
        const coffee = parts.find((p) => p.raw === "Coffee");
        const coffeeText = coffee ? ` ${coffee.count} of those were coffees, ${eur(coffee.total)} in total.` : "";
        const ownText = own != null && total > own ? ` You set yourself ${eur0(own)}.` : "";
        return result(`${eur0(total)} on eating out and coffee in October.${coffeeText}${ownText}${vsPeers}`, total > (own ?? Infinity) ? "shocked" : "watching");
      }
      case "transport": {
        const taxi = parts.find((p) => p.raw === "Taxi / Bolt");
        return result(taxi ? `${taxi.count} taxi rides cost ${eur(taxi.total)} in October.${vsPeers}` : `${eur(total)} on getting around. Steady and sensible.`, taxi && taxi.total > 15 ? "watching" : "proud");
      }
      case "subscriptions": {
        const names = s.subscriptions.length ? ` (${s.subscriptions.join(", ")})` : "";
        return result(`${eur(total)} a month on subscriptions and phone${names}. That's ${eur0(total * 12)} a year. Still using all of them?`, "watching");
      }
      case "fun":
        return result(`${eur(total)} on entertainment, sport and travel. Fun is allowed. Plan it, and it stops being a surprise.${vsPeers}`, "happy");
      case "shopping":
        return result(`${eur(total)} on shopping, tech and other buys.${own != null && total > own ? ` Your own limit was ${eur0(own)}.` : ""}${vsPeers}`, own != null && total > own ? "watching" : "happy");
      case "care":
        return result(`${eur(total)} on study and health. That's an investment in you, not a habit to cut.`, "proud");
    }
  };

  return { student: s, previous, history, current, income, categories, fixed, flexible, focus, ownBudget, suggested, remaining, projected, insight };
};

const cache = new Map<string, StudentModel>();
export const modelFor = (id: string) => {
  const s = studentById(id);
  if (!cache.has(s.id)) cache.set(s.id, build(s));
  return cache.get(s.id)!;
};

export const sumBudget = (b: Budget) => Object.values(b).reduce((s, v) => s + v, 0);

/* ---------- headline numbers for the landing page ---------- */

export const datasetStats = () => {
  const incomes = STUDENTS.map((s) => s.income.total).sort((a, b) => a - b);
  const monthlySpend = (s: Student) => s.tx.filter((t) => t.cat !== "income" && t.month < 2).reduce((sum, t) => sum - t.amount, 0) / 2;
  const overspenders = STUDENTS.filter((s) => monthlySpend(s) > s.income.total).length;
  const coffeePerMonth = STUDENTS.reduce((sum, s) => sum + s.tx.filter((t) => t.raw === "Coffee").length, 0) / STUDENTS.length / 3;
  const byCat = STUDENT_CATEGORIES.map((c) => ({ ...c, avg: cohortAverage(c.id) })).sort((a, b) => b.avg - a.avg);
  const goals = Object.entries(
    STUDENTS.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s.goal.name]: (acc[s.goal.name] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);
  return {
    students: STUDENTS.length,
    transactions: STUDENTS.reduce((sum, s) => sum + s.tx.length, 0),
    universities: new Set(STUDENTS.map((s) => s.university)).size,
    medianIncome: Math.round((incomes[19] + incomes[20]) / 2),
    overspenders,
    coffeePerMonth: Math.round(coffeePerMonth),
    byCat,
    goals,
  };
};
