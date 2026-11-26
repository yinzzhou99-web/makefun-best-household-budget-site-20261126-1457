// Hearth — router and wiring. Hash routes, month switching, the add-transaction
// form, budget editing, goal contributions and transaction search/filters.

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const fn = VIEWS[hash] || VIEWS["/"];
  const app = document.getElementById("app");
  app.innerHTML = fn();
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + hash);
  });
  wirePage(hash);
  window.scrollTo(0, 0);
}

function wirePage(hash) {
  document.querySelectorAll("[data-month]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentMonth = btn.getAttribute("data-month");
      route();
    });
  });

  const form = document.getElementById("tx-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const tx = {
        id: "u" + Date.now().toString(36),
        month: currentMonth,
        date: String(fd.get("date") || "2026-11-26"),
        merchant: String(fd.get("merchant") || "").trim(),
        category: String(fd.get("category") || "groceries"),
        amount: Math.round(Number(fd.get("amount")) * 100) / 100,
        note: String(fd.get("note") || "").trim(),
      };
      if (!tx.merchant || !(tx.amount > 0)) return;
      store.extraTx.push(tx);
      saveStore();
      const ok = document.getElementById("tx-added");
      if (ok) ok.hidden = false;
      form.reset();
      form.querySelector('[name="date"]').value = tx.date;
      setTimeout(route, 600);
    });
  }

  const catSel = document.getElementById("tx-cat");
  if (catSel) catSel.addEventListener("change", () => { txFilter.category = catSel.value; route(); });
  const search = document.getElementById("tx-search");
  if (search) search.addEventListener("input", () => { txFilter.query = search.value; route(); });

  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.deletedTx.push(btn.getAttribute("data-del"));
      saveStore();
      route();
    });
  });

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = document.getElementById("edit-" + btn.getAttribute("data-edit"));
      if (box) box.hidden = !box.hidden;
    });
  });

  document.querySelectorAll("[data-save]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-save");
      const input = document.querySelector('[data-plan="' + id + '"]');
      const val = Math.round(Number(input.value));
      if (val >= 0) {
        store.budgets[id] = val;
        saveStore();
        route();
      }
    });
  });

  document.querySelectorAll("[data-contribute]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-contribute");
      const input = document.querySelector('[data-add="' + id + '"]');
      const val = Math.round(Number(input.value));
      if (val > 0) {
        store.goals[id] = (store.goals[id] || 0) + val;
        saveStore();
        const ok = document.getElementById("ok-" + id);
        if (ok) ok.hidden = false;
        setTimeout(route, 600);
      }
    });
  });
}

window.addEventListener("hashchange", route);
document.addEventListener("DOMContentLoaded", route);
