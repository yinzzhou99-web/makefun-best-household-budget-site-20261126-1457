// Hearth — household budget data.
// One household, two months of real figures. Everything the pages show comes
// from here; edits the household makes are kept in localStorage on top of it.

const HOUSEHOLD = {
  name: "The Alvarez Family",
  members: ["Maya", "Daniel", "Sofia", "Leo"],
  home: "3-bed house, Maple Street",
  currency: "USD",
};

const MONTHS = [
  { id: "2026-11", label: "November 2026", short: "Nov" },
  { id: "2026-10", label: "October 2026", short: "Oct" },
];

const CATEGORIES = [
  { id: "housing", name: "Housing", color: "#2f6b4f", icon: "⌂" },
  { id: "groceries", name: "Groceries", color: "#c96f2e", icon: "◍" },
  { id: "utilities", name: "Utilities", color: "#4a7fa5", icon: "⚡" },
  { id: "transport", name: "Transport", color: "#7a5ea8", icon: "➤" },
  { id: "dining", name: "Dining Out", color: "#c2455a", icon: "✦" },
  { id: "fun", name: "Entertainment", color: "#b98a1d", icon: "♪" },
  { id: "health", name: "Health", color: "#3d8f7b", icon: "+" },
  { id: "kids", name: "Kids & School", color: "#5b7ec4", icon: "✎" },
  { id: "home", name: "Home & Garden", color: "#8a6d4b", icon: "❀" },
  { id: "personal", name: "Personal", color: "#94608a", icon: "♥" },
  { id: "savings", name: "Savings", color: "#2f6b4f", icon: "◆" },
];

// Planned monthly budget per category (November; October used the same plan).
const BUDGETS = {
  housing: 1850, groceries: 950, utilities: 310, transport: 420,
  dining: 260, fun: 180, health: 240, kids: 350,
  home: 200, personal: 260, savings: 900,
};

const INCOME = [
  { id: "inc-1", month: "2026-11", date: "2026-11-01", source: "Maya — salary, Northwind Clinic", amount: 4200 },
  { id: "inc-2", month: "2026-11", date: "2026-11-01", source: "Daniel — salary, Harbor Logistics", amount: 2650 },
  { id: "inc-3", month: "2026-11", date: "2026-11-14", source: "Daniel — weekend overtime", amount: 186 },
  { id: "inc-4", month: "2026-10", date: "2026-10-01", source: "Maya — salary, Northwind Clinic", amount: 4200 },
  { id: "inc-5", month: "2026-10", date: "2026-10-01", source: "Daniel — salary, Harbor Logistics", amount: 2650 },
  { id: "inc-6", month: "2026-10", date: "2026-10-20", source: "Sold old bikes", amount: 240 },
];

// date, merchant, category, amount, note. Negative amounts are refunds.
const SEED_TX = [
  { id: "t01", month: "2026-11", date: "2026-11-01", merchant: "Maple Street Mortgage", category: "housing", amount: 1850.00, note: "Monthly mortgage" },
  { id: "t02", month: "2026-11", date: "2026-11-02", merchant: "GreenMart Supermarket", category: "groceries", amount: 148.62, note: "Weekly shop" },
  { id: "t03", month: "2026-11", date: "2026-11-03", merchant: "City Power & Light", category: "utilities", amount: 132.40, note: "Electricity" },
  { id: "t04", month: "2026-11", date: "2026-11-04", merchant: "Shell — Maple Ave", category: "transport", amount: 52.30, note: "Fuel, Daniel's car" },
  { id: "t05", month: "2026-11", date: "2026-11-05", merchant: "GreenMart Supermarket", category: "groceries", amount: 96.18, note: "Midweek top-up" },
  { id: "t06", month: "2026-11", date: "2026-11-06", merchant: "Pasta Fresca", category: "dining", amount: 64.50, note: "Family dinner out" },
  { id: "t07", month: "2026-11", date: "2026-11-07", merchant: "BrightSmile Dentist", category: "health", amount: 85.00, note: "Leo check-up" },
  { id: "t08", month: "2026-11", date: "2026-11-08", merchant: "GreenMart Supermarket", category: "groceries", amount: 171.44, note: "Weekly shop" },
  { id: "t09", month: "2026-11", date: "2026-11-09", merchant: "Metro Transit", category: "transport", amount: 68.00, note: "Monthly bus passes" },
  { id: "t10", month: "2026-11", date: "2026-11-10", merchant: "Riverdale Cinema", category: "fun", amount: 42.00, note: "Movie night, 4 tickets" },
  { id: "t11", month: "2026-11", date: "2026-11-11", merchant: "Kids Corner Books", category: "kids", amount: 38.90, note: "Sofia reading books" },
  { id: "t12", month: "2026-11", date: "2026-11-12", merchant: "GreenMart Supermarket", category: "groceries", amount: 122.75, note: "Weekly shop" },
  { id: "t13", month: "2026-11", date: "2026-11-13", merchant: "Aqua Municipal Water", category: "utilities", amount: 48.60, note: "Water bill" },
  { id: "t14", month: "2026-11", date: "2026-11-14", merchant: "Burger Barn", category: "dining", amount: 38.20, note: "Lunch after soccer" },
  { id: "t15", month: "2026-11", date: "2026-11-15", merchant: "PharmaPlus", category: "health", amount: 54.30, note: "Prescriptions" },
  { id: "t16", month: "2026-11", date: "2026-11-16", merchant: "GreenMart Supermarket", category: "groceries", amount: 139.05, note: "Weekly shop" },
  { id: "t17", month: "2026-11", date: "2026-11-17", merchant: "Shell — Maple Ave", category: "transport", amount: 48.75, note: "Fuel, Maya's car" },
  { id: "t18", month: "2026-11", date: "2026-11-18", merchant: "Sunny Garden Centre", category: "home", amount: 63.40, note: "Winter plants" },
  { id: "t19", month: "2026-11", date: "2026-11-19", merchant: "Noodle House", category: "dining", amount: 52.80, note: "Takeaway Thursday" },
  { id: "t20", month: "2026-11", date: "2026-11-20", merchant: "StreamFlix", category: "fun", amount: 15.99, note: "Monthly streaming" },
  { id: "t21", month: "2026-11", date: "2026-11-21", merchant: "GreenMart Supermarket", category: "groceries", amount: 88.30, note: "Weekly shop" },
  { id: "t22", month: "2026-11", date: "2026-11-21", merchant: "PlayZone Arcade", category: "kids", amount: 46.00, note: "Leo birthday party share" },
  { id: "t23", month: "2026-11", date: "2026-11-22", merchant: "NorthNet Internet", category: "utilities", amount: 79.00, note: "Internet + phone" },
  { id: "t24", month: "2026-11", date: "2026-11-23", merchant: "GreenMart Supermarket", category: "groceries", amount: 104.15, note: "Thanksgiving prep" },
  { id: "t25", month: "2026-11", date: "2026-11-24", merchant: "Cozy Corner Cafe", category: "dining", amount: 27.40, note: "Coffee with neighbours" },
  { id: "t26", month: "2026-11", date: "2026-11-25", merchant: "AutoCare Garage", category: "transport", amount: 189.00, note: "Oil change + brakes check" },
  { id: "t27", month: "2026-11", date: "2026-11-25", merchant: "GreenMart Supermarket", category: "groceries", amount: 62.90, note: "Top-up" },
  { id: "t28", month: "2026-11", date: "2026-11-26", merchant: "Transfer to Emergency Fund", category: "savings", amount: 900.00, note: "Auto-transfer" },
  { id: "t29", month: "2026-11", date: "2026-11-26", merchant: "GreenMart refund", category: "groceries", amount: -12.40, note: "Returned spoiled milk" },
  { id: "t30", month: "2026-11", date: "2026-11-15", merchant: "Corner Barbers", category: "personal", amount: 38.00, note: "Maya haircut" },
  { id: "o01", month: "2026-10", date: "2026-10-01", merchant: "Maple Street Mortgage", category: "housing", amount: 1850.00, note: "Monthly mortgage" },
  { id: "o02", month: "2026-10", date: "2026-10-05", merchant: "GreenMart Supermarket", category: "groceries", amount: 162.10, note: "Weekly shop" },
  { id: "o03", month: "2026-10", date: "2026-10-07", merchant: "City Power & Light", category: "utilities", amount: 148.20, note: "Electricity" },
  { id: "o04", month: "2026-10", date: "2026-10-09", merchant: "Shell — Maple Ave", category: "transport", amount: 58.40, note: "Fuel" },
  { id: "o05", month: "2026-10", date: "2026-10-12", merchant: "GreenMart Supermarket", category: "groceries", amount: 131.55, note: "Weekly shop" },
  { id: "o06", month: "2026-10", date: "2026-10-15", merchant: "Pasta Fresca", category: "dining", amount: 71.30, note: "Anniversary dinner" },
  { id: "o07", month: "2026-10", date: "2026-10-18", merchant: "GreenMart Supermarket", category: "groceries", amount: 118.90, note: "Weekly shop" },
  { id: "o08", month: "2026-10", date: "2026-10-21", merchant: "BrightSmile Dentist", category: "health", amount: 120.00, note: "Maya cleaning" },
  { id: "o09", month: "2026-10", date: "2026-10-24", merchant: "Riverdale Cinema", category: "fun", amount: 36.00, note: "Movie night" },
  { id: "o10", month: "2026-10", date: "2026-10-26", merchant: "GreenMart Supermarket", category: "groceries", amount: 144.70, note: "Weekly shop" },
  { id: "o11", month: "2026-10", date: "2026-10-28", merchant: "Transfer to Emergency Fund", category: "savings", amount: 900.00, note: "Auto-transfer" },
  { id: "o12", month: "2026-10", date: "2026-10-30", merchant: "Kids Corner Books", category: "kids", amount: 52.40, note: "School supplies" },
];

const GOALS = [
  { id: "g1", name: "Emergency fund", detail: "6 months of essentials, in a high-yield savings account", target: 10000, saved: 6240, color: "#2f6b4f" },
  { id: "g2", name: "Summer road trip", detail: "Two weeks driving the coast, June 2027", target: 2400, saved: 1150, color: "#c96f2e" },
  { id: "g3", name: "New family car", detail: "Replace the 2014 sedan before next winter", target: 15000, saved: 3800, color: "#4a7fa5" },
  { id: "g4", name: "Kitchen refresh", detail: "New counters and a dishwasher that works", target: 3200, saved: 940, color: "#7a5ea8" },
];

// Six-month spending history for the reports chart (Jul–Dec 2026, Dec is a plan).
const HISTORY = [
  { month: "Jul", income: 6850, spent: 5120 },
  { month: "Aug", income: 6850, spent: 5388 },
  { month: "Sep", income: 7010, spent: 5264 },
  { month: "Oct", income: 7090, spent: 3794 },
  { month: "Nov", income: 7036, spent: 4856 },
  { month: "Dec", income: 6850, spent: 4980 },
];

// --- State: seed data plus the household's own edits, kept in localStorage. ---
const STORE_KEY = "hearth-budget-v1";

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { extraTx: [], deletedTx: [], budgets: {}, goals: {} };
    return JSON.parse(raw);
  } catch (e) {
    return { extraTx: [], deletedTx: [], budgets: {}, goals: {} };
  }
}

let store = loadStore();

function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {}
}

function allTransactions() {
  const gone = new Set(store.deletedTx);
  return SEED_TX.filter((t) => !gone.has(t.id)).concat(store.extraTx);
}

function monthTransactions(monthId) {
  return allTransactions()
    .filter((t) => t.month === monthId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function monthIncome(monthId) {
  return INCOME.filter((i) => i.month === monthId)
    .reduce((sum, i) => sum + i.amount, 0);
}

function categorySpent(monthId) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of allTransactions()) {
    if (t.month === monthId) out[t.category] = (out[t.category] || 0) + t.amount;
  }
  return out;
}

function budgetFor(catId) {
  return store.budgets[catId] != null ? store.budgets[catId] : BUDGETS[catId];
}

function totalBudget() {
  return CATEGORIES.reduce((s, c) => s + budgetFor(c.id), 0);
}

function monthSpent(monthId) {
  return Object.values(categorySpent(monthId)).reduce((s, v) => s + v, 0);
}

function goalSaved(goal) {
  return (store.goals[goal.id] || 0) + goal.saved;
}

function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { name: id, color: "#888", icon: "•" };
}

function money(n) {
  const sign = n < 0 ? "−" : "";
  return sign + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function money0(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
