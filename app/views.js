// Hearth — page renderers. Each route returns the HTML for one page of the
// household budget site. All figures come from data.js; every control on a
// page is wired in main.js.

let currentMonth = "2026-11";
let txFilter = { category: "all", query: "" };

function monthLabel() {
  const m = MONTHS.find((x) => x.id === currentMonth);
  return m ? m.label : currentMonth;
}

function monthSwitcher() {
  return '<div class="month-switch" role="group" aria-label="Choose month">' +
    MONTHS.map((m) =>
      '<button data-month="' + m.id + '" class="' + (m.id === currentMonth ? "active" : "") + '">' + m.short + ' 2026</button>'
    ).join("") + "</div>";
}

function viewDashboard() {
  const income = monthIncome(currentMonth);
  const spent = monthSpent(currentMonth);
  const left = income - spent;
  const saved = categorySpent(currentMonth).savings || 0;
  const rate = pct(saved, income);
  const byCat = categorySpent(currentMonth);
  const sorted = CATEGORIES.filter((c) => c.id !== "savings")
    .map((c) => ({ cat: c, spent: byCat[c.id] || 0, plan: budgetFor(c.id) }))
    .sort((a, b) => b.spent - a.spent);
  const top = sorted.slice(0, 5);
  const recent = monthTransactions(currentMonth).slice(0, 6);
  const goalsHtml = GOALS.slice(0, 2).map((g) => {
    const have = goalSaved(g);
    return '<li><div class="goal-line"><strong>' + esc(g.name) + '</strong><span>' + money0(have) + ' of ' + money0(g.target) + '</span></div>' +
      budgetBar(have, g.target, g.color) + '<small>' + pct(have, g.target) + '% there</small></li>';
  }).join("");

  return '' +
  '<section class="hero"><div><p class="eyebrow">Household budget · ' + monthLabel() + '</p>' +
  '<h1>Good evening, Alvarez family.</h1>' +
  '<p class="lede">November is tracking well: spending sits under plan in all 11 categories, and the emergency fund crossed $6,000 this month.</p></div>' +
  monthSwitcher() + '</section>' +

  '<section class="cards">' +
    '<article class="card big"><span class="k">Income</span><strong>' + money(income) + '</strong><small>2 salaries + overtime</small></article>' +
    '<article class="card big"><span class="k">Spent</span><strong>' + money(spent) + '</strong><small>across ' + CATEGORIES.length + ' categories</small></article>' +
    '<article class="card big"><span class="k">Left over</span><strong class="good">' + money(left) + '</strong><small>unspent this month</small></article>' +
    '<article class="card big"><span class="k">Savings rate</span><strong>' + rate + '%</strong><small>' + money(saved) + ' moved to savings</small></article>' +
  '</section>' +

  '<section class="grid2">' +
    '<article class="panel"><h2>Where the money went</h2>' +
      top.map((row) =>
        '<div class="cat-row"><span class="cat-ic" style="background:' + row.cat.color + '">' + row.cat.icon + '</span>' +
        '<div class="cat-body"><div class="cat-line"><strong>' + row.cat.name + '</strong><span>' + money(row.spent) + ' / ' + money0(row.plan) + '</span></div>' +
        budgetBar(row.spent, row.plan, row.cat.color) + '</div></div>'
      ).join("") +
      '<p class="more"><a href="#/budgets">See all budgets →</a></p></article>' +

    '<article class="panel"><h2>Recent spending</h2><ul class="tx-list">' +
      recent.map((t) => {
        const c = categoryById(t.category);
        return '<li><span class="cat-ic" style="background:' + c.color + '">' + c.icon + '</span>' +
          '<div><strong>' + esc(t.merchant) + '</strong><small>' + t.date + ' · ' + c.name + '</small></div>' +
          '<b class="' + (t.amount < 0 ? "good" : "") + '">' + money(t.amount) + '</b></li>';
      }).join("") +
      '</ul><p class="more"><a href="#/transactions">All transactions →</a></p></article>' +
  '</section>' +

  '<section class="grid2">' +
    '<article class="panel"><h2>Savings goals</h2><ul class="goal-list">' + goalsHtml + '</ul>' +
      '<p class="more"><a href="#/goals">All four goals →</a></p></article>' +
    '<article class="panel tip"><h2>This month’s tip</h2>' +
      '<p>Groceries are running $29 under plan with a week to go. Moving that $29 to the road-trip fund would put it at 49% — nearly halfway there.</p>' +
      '<p><a class="btn" href="#/goals">Add $29 to the trip fund</a></p></article>' +
  '</section>';
}

function viewTransactions() {
  const all = monthTransactions(currentMonth);
  const q = txFilter.query.trim().toLowerCase();
  const list = all.filter((t) => {
    if (txFilter.category !== "all" && t.category !== txFilter.category) return false;
    if (q && (t.merchant + " " + t.note).toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
  const total = list.reduce((s, t) => s + t.amount, 0);

  return '' +
  '<section class="page-head"><div><p class="eyebrow">Transactions</p><h1>Every dollar, accounted for.</h1>' +
  '<p class="lede">Add spending as it happens — the dashboard, budgets and reports all update from this list.</p></div>' +
  monthSwitcher() + '</section>' +

  '<section class="panel"><h2>Add a transaction</h2>' +
  '<form id="tx-form" class="form-grid">' +
    '<label>Date<input type="date" name="date" value="2026-11-26" required></label>' +
    '<label>Merchant<input type="text" name="merchant" placeholder="e.g. GreenMart Supermarket" required></label>' +
    '<label>Category<select name="category">' +
      CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.name + '</option>').join("") +
    '</select></label>' +
    '<label>Amount ($)<input type="number" name="amount" step="0.01" min="0.01" placeholder="42.50" required></label>' +
    '<label class="wide">Note<input type="text" name="note" placeholder="What was it for?"></label>' +
    '<button class="btn" type="submit">Add transaction</button>' +
  '</form><p id="tx-added" class="ok" hidden>Added — totals updated.</p></section>' +

  '<section class="panel"><div class="panel-head"><h2>' + list.length + ' transactions · ' + money(total) + '</h2>' +
  '<div class="filters"><select id="tx-cat" aria-label="Filter by category">' +
    '<option value="all">All categories</option>' +
    CATEGORIES.map((c) => '<option value="' + c.id + '"' + (txFilter.category === c.id ? " selected" : "") + '>' + c.name + '</option>').join("") +
  '</select><input id="tx-search" type="search" placeholder="Search merchant or note…" value="' + esc(txFilter.query) + '" aria-label="Search transactions"></div></div>' +
  (list.length ? '<ul class="tx-list full">' + list.map((t) => {
    const c = categoryById(t.category);
    const mine = String(t.id).indexOf("u") === 0;
    return '<li><span class="cat-ic" style="background:' + c.color + '">' + c.icon + '</span>' +
      '<div><strong>' + esc(t.merchant) + '</strong><small>' + t.date + ' · ' + c.name + (t.note ? " · " + esc(t.note) : "") + '</small></div>' +
      '<b class="' + (t.amount < 0 ? "good" : "") + '">' + money(t.amount) + '</b>' +
      (mine ? '<button class="del" data-del="' + t.id + '" title="Remove">×</button>' : "") + '</li>';
  }).join("") + '</ul>' : '<p class="empty">Nothing matches — clear the filter or add a transaction above.</p>') +
  '</section>';
}

function viewBudgets() {
  const byCat = categorySpent(currentMonth);
  const plan = totalBudget();
  const spent = monthSpent(currentMonth);
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Budgets</p><h1>A plan for every dollar.</h1>' +
  '<p class="lede">November’s plan is ' + money0(plan) + ' against ' + money0(monthIncome(currentMonth)) + ' of income. Tap a plan amount to change it — the bars and the dashboard follow.</p></div>' +
  monthSwitcher() + '</section>' +
  '<section class="cards"><article class="card big"><span class="k">Planned</span><strong>' + money(plan) + '</strong><small>11 categories</small></article>' +
  '<article class="card big"><span class="k">Spent so far</span><strong>' + money(spent) + '</strong><small>' + pct(spent, plan) + '% of plan</small></article>' +
  '<article class="card big"><span class="k">Still to spend</span><strong class="good">' + money(plan - spent) + '</strong><small>before the month ends</small></article></section>' +
  '<section class="budget-grid">' +
  CATEGORIES.map((c) => {
    const s = byCat[c.id] || 0, p = budgetFor(c.id), over = s > p;
    return '<article class="panel budget-card"><div class="budget-top"><span class="cat-ic big" style="background:' + c.color + '">' + c.icon + '</span>' +
      '<div><h2>' + c.name + '</h2><small>' + (over ? "Over plan by " + money(s - p) : money(p - s) + " left") + '</small></div>' +
      '<button class="edit-btn" data-edit="' + c.id + '">Edit plan</button></div>' +
      '<div class="budget-figs"><strong>' + money(s) + '</strong><span>of <button class="plan-amount" data-edit="' + c.id + '">' + money0(p) + '</button> planned</span></div>' +
      budgetBar(s, p, c.color) +
      '<div class="budget-edit" id="edit-' + c.id + '" hidden><label>New monthly plan $<input type="number" min="0" step="10" value="' + p + '" data-plan="' + c.id + '"></label>' +
      '<button class="btn small" data-save="' + c.id + '">Save plan</button></div>' +
      '</article>';
  }).join("") + '</section>';
}

function viewGoals() {
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Savings goals</p><h1>What we’re saving for.</h1>' +
  '<p class="lede">Four goals, one household. Add money to any goal and the progress bars move — contributions come straight out of this month’s leftover.</p></div></section>' +
  '<section class="goal-grid">' +
  GOALS.map((g) => {
    const have = goalSaved(g);
    const left = g.target - have;
    return '<article class="panel goal-card"><div class="goal-head"><span class="cat-ic big" style="background:' + g.color + '">◆</span>' +
      '<div><h2>' + esc(g.name) + '</h2><small>' + esc(g.detail) + '</small></div></div>' +
      '<div class="goal-big"><strong>' + money0(have) + '</strong><span>saved of ' + money0(g.target) + ' · ' + pct(have, g.target) + '%</span></div>' +
      budgetBar(have, g.target, g.color) +
      '<p class="goal-left">' + (left > 0 ? money0(left) + ' to go' : 'Goal reached — nicely done.') + '</p>' +
      '<div class="goal-add"><label>Add $<input type="number" min="1" step="5" value="25" data-add="' + g.id + '" aria-label="Amount to add to ' + esc(g.name) + '"></label>' +
      '<button class="btn small" data-contribute="' + g.id + '">Add to goal</button></div>' +
      '<p class="ok" id="ok-' + g.id + '" hidden>Added — progress updated.</p></article>';
  }).join("") + '</section>' +
  '<section class="panel tip"><h2>How the goals are funded</h2>' +
  '<p>Every month $900 moves to savings automatically on the 26th, then the household splits it: $500 to the emergency fund, $200 to the car, $100 to the trip and $100 to the kitchen. Anything left over at month end goes to the goal furthest from its target.</p></section>';
}

function viewReports() {
  const byCat = categorySpent("2026-11");
  const segs = CATEGORIES.filter((c) => (byCat[c.id] || 0) > 0)
    .map((c) => ({ value: byCat[c.id], color: c.color, name: c.name }))
    .sort((a, b) => b.value - a.value);
  const topSpend = segs.slice(0, 3);
  const nov = HISTORY.find((h) => h.month === "Nov");
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Reports</p><h1>Six months at a glance.</h1>' +
  '<p class="lede">Spending has stayed under income every month since July. November came in at ' + money0(nov.spent) + ' against ' + money0(nov.income) + ' of income — ' + money0(nov.income - nov.spent) + ' left over.</p></div></section>' +
  '<section class="grid2">' +
    '<article class="panel"><h2>Income vs spending</h2>' + barChart(HISTORY) +
    '<p class="legend"><span class="sw" style="background:#2f6b4f"></span> Income <span class="sw" style="background:#c96f2e"></span> Spending</p></article>' +
    '<article class="panel"><h2>November by category</h2><div class="donut-wrap">' + donut(segs) +
    '<ul class="donut-key">' + segs.map((s) => '<li><span class="sw" style="background:' + s.color + '"></span>' + s.name + ' <b>' + money0(s.value) + '</b></li>').join("") + '</ul></div></article>' +
  '</section>' +
  '<section class="panel"><h2>What the numbers say</h2><ul class="insights">' +
    '<li><strong>Housing is the anchor.</strong> ' + money0(byCat.housing || 0) + ' — ' + pct(byCat.housing || 0, monthSpent("2026-11")) + '% of November spending — never moves, so the plan starts there.</li>' +
    '<li><strong>Groceries are the lever.</strong> ' + topSpend[1].name + ' is the second-biggest spend at ' + money0(topSpend[1].value) + '; the weekly shop varies by up to $80, which is where savings actually come from.</li>' +
    '<li><strong>Small leaks add up.</strong> Dining out and entertainment together are ' + money0((byCat.dining || 0) + (byCat.fun || 0)) + ' this month — one takeaway less a week would fund the road trip by spring.</li>' +
    '<li><strong>The plan holds.</strong> Six months in, the household has saved ' + money0(HISTORY.reduce((s, h) => s + (h.income - h.spent), 0)) + ' over income — every dollar of it sitting in the four goals above.</li>' +
  '</ul></section>';
}

const VIEWS = {
  "/": viewDashboard,
  "/transactions": viewTransactions,
  "/budgets": viewBudgets,
  "/goals": viewGoals,
  "/reports": viewReports,
};
