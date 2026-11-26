# Hearth — Household Budget

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/yinzzhou99-web/makefun-best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/yinzzhou99-web/makefun-best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A household budget site for the Alvarez family — dashboard, transactions, budgets, savings goals and reports — that runs entirely offline from static files. Built for [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457) on make.fun.

## What it does

- **Dashboard** — November income, spending, leftover cash and savings rate, top spending categories with budget bars, recent transactions, goal progress.
- **Transactions** — every dollar listed, with category filter and search; add a transaction (it saves on the device and updates every page) or remove one you added.
- **Budgets** — a plan for each of 11 categories; tap a plan amount to edit it and watch the bars and dashboard follow.
- **Goals** — four savings goals (emergency fund, road trip, family car, kitchen refresh) with progress bars and one-tap contributions.
- **Reports** — six months of income vs spending as a chart, a November category donut, and four plain-language insights.
- **Two months of data** — switch between November and October 2026; every figure is real and consistent across pages.

## Run it

No build step, no network, no account. Serve `app/` with any static server and open `index.html`:

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

MIT licensed.
