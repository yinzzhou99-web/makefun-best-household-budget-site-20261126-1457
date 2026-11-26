// Hearth — small SVG charts, drawn by hand, no library.
// barChart: grouped income vs spending bars. donut: category share ring.

function barChart(rows, opts) {
  const w = (opts && opts.width) || 640;
  const h = (opts && opts.height) || 260;
  const padL = 44, padB = 28, padT = 14;
  const max = Math.max.apply(null, rows.map((r) => Math.max(r.income, r.spent))) * 1.08;
  const plotW = w - padL - 12;
  const plotH = h - padT - padB;
  const groupW = plotW / rows.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  let svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Monthly income versus spending">';
  for (let g = 0; g <= 4; g++) {
    const y = padT + (plotH * g) / 4;
    const val = Math.round((max * (4 - g)) / 4);
    svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (w - 12) + '" y2="' + y + '" stroke="#e7dfd2" stroke-width="1"/>';
    svg += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="#8a7d6b">$' + (val / 1000).toFixed(1) + 'k</text>';
  }
  rows.forEach((r, i) => {
    const cx = padL + groupW * i + groupW / 2;
    const ih = (r.income / max) * plotH;
    const sh = (r.spent / max) * plotH;
    svg += '<rect x="' + (cx - barW - 3) + '" y="' + (padT + plotH - ih) + '" width="' + barW + '" height="' + ih + '" rx="3" fill="#2f6b4f"/>';
    svg += '<rect x="' + (cx + 3) + '" y="' + (padT + plotH - sh) + '" width="' + barW + '" height="' + sh + '" rx="3" fill="#c96f2e"/>';
    svg += '<text x="' + cx + '" y="' + (h - 8) + '" text-anchor="middle" font-size="12" fill="#5c5142">' + esc(r.month) + '</text>';
  });
  svg += '</svg>';
  return svg;
}

function donut(segments, opts) {
  const size = (opts && opts.size) || 220;
  const thick = (opts && opts.thick) || 34;
  const r = size / 2 - thick / 2 - 4;
  const cx = size / 2, cy = size / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let svg = '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending by category">';
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#efe8db" stroke-width="' + thick + '"/>';
  let angle = -Math.PI / 2;
  for (const seg of segments) {
    if (seg.value <= 0) continue;
    const frac = seg.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    svg += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke="' + seg.color + '" stroke-width="' + thick + '"/>';
    angle = a1;
  }
  svg += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="13" fill="#8a7d6b">Spent in Nov</text>';
  svg += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="20" font-weight="700" fill="#2b2620">' + money0(total) + '</text>';
  svg += '</svg>';
  return svg;
}

// Horizontal budget bar: spent vs planned, with an over-budget state.
function budgetBar(spent, planned, color) {
  const ratio = planned ? Math.min(spent / planned, 1) : 0;
  const over = spent > planned;
  const cls = over ? "bar over" : "bar";
  return '<div class="' + cls + '"><span style="width:' + Math.round(ratio * 100) + '%;background:' + color + '"></span></div>';
}
