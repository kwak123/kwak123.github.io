'use client';

import React, { useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Pure parsing / generation logic (ported verbatim from the standalone app)
// ---------------------------------------------------------------------------

interface Row {
  sym: string;
  res: string[];
  sup: string[];
}

interface ParseError {
  line: number;
  text: string;
  msg: string;
}

interface Parsed {
  rows: Row[];
  errors: ParseError[];
}

const SAMPLE = [
  '$AAOI 121 136 153 / 114 96 84',
  '$AAPL 317 325 332 / 311 297 288',
  '$AMD 552 592 621 / 521 481 451',
  '$APP 529 538 571 / 504 471 432',
  '$ASML 1793 1821 1909 / 1750 1683 1543',
  '$AVGO 407 421 439 / 375 362 354',
  '$DELL 441 462 492 / 411 344 314',
  '$GOOGL 362 373 384 / 353 342 329',
  '$GS 1062 1092 1121 / 1041 1010 979',
  '$IBM 296 309 321 / 271 261 252',
  '$INTC 117 123 133 / 105 95 84',
  '$LLY 1212 1252 1292 / 1161 1086 1020',
  '$META 672 700 721 / 631 615 600',
  '$MU 972 1052 1132 / 899 809 721',
  '$NOW 110 116 121 / 107 101 94',
  '$NBIS 223 235 242 / 208 182 170',
  '$NVDA 211 218 225 / 197 191 188',
  '$ORCL 147 170 183 / 139 130 121',
  '$QCOM 192 207 221 / 183 169 163',
  '$SKHY 175 200 221 / 150 126 100',
  '$TSLA 409 421 440 / 397 377 356',
  '$TSM 444 462 482 / 432 423 400',
].join('\n');

function numbers(s: string): string[] {
  const out: string[] = [];
  const toks = s.trim().split(/[\s,]+/);
  for (const tok of toks) {
    if (tok === '') continue;
    if (!isNaN(Number(tok))) out.push(tok);
  }
  return out;
}

function parse(text: string): Parsed {
  const rows: Row[] = [];
  const errors: ParseError[] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    // ticker: optional leading $, letters/digits/dots
    const m = raw.match(/^\$?([A-Za-z][A-Za-z0-9._-]*)\s+(.*)$/);
    if (!m) {
      errors.push({ line: i + 1, text: raw, msg: 'no ticker found' });
      continue;
    }
    const sym = m[1].toUpperCase();
    const halves = m[2].split('/');
    if (halves.length < 2) {
      errors.push({ line: i + 1, text: raw, msg: "missing '/' separating resistance / support" });
      continue;
    }
    const res = numbers(halves[0]);
    const sup = numbers(halves[1]);
    if (res.length === 0 && sup.length === 0) {
      errors.push({ line: i + 1, text: raw, msg: 'no numeric levels' });
      continue;
    }
    rows.push({ sym, res, sup });
  }
  return { rows, errors };
}

function buildPlot(
  name: string,
  color: string,
  weight: number,
  rows: Row[],
  kind: 'res' | 'sup',
  idx: number,
): string | null {
  const lines: string[] = [];
  lines.push('plot ' + name + ' = (');
  const branches: string[] = [];
  for (const row of rows) {
    const arr = kind === 'res' ? row.res : row.sup;
    if (idx < arr.length) {
      branches.push('    if GetSymbol() == "' + row.sym + '" then ' + String(arr[idx]));
    }
  }
  if (branches.length === 0) return null;
  lines.push(branches.join('\n    else ') + '\n    else Double.NaN);');
  lines.push(name + '.SetDefaultColor(' + color + ');');
  lines.push(name + '.SetLineWeight(' + weight + ');');
  lines.push(name + '.SetStyle(Curve.FIRM);');
  // resistance bubbles point up, support bubbles point down (out of the way)
  const up = kind === 'res' ? 'yes' : 'no';
  lines.push(
    'AddChartBubble(showLabels and labelBar, ' + name + ', "' + name + '  " + ' + name + ', ' + color + ', ' + up + ');',
  );
  return lines.join('\n');
}

function generate(rows: Row[]): string {
  if (rows.length === 0) return '# Paste ticker levels on the left to generate a script.';

  let maxRes = 0;
  let maxSup = 0;
  for (const row of rows) {
    if (row.res.length > maxRes) maxRes = row.res.length;
    if (row.sup.length > maxSup) maxSup = row.sup.length;
  }

  const head: string[] = [];
  head.push('# ===================================================================');
  head.push('#  Support / Resistance Levels  (auto-generated)');
  head.push('#  ' + rows.length + ' symbols  |  ' + maxRes + ' resistance + ' + maxSup + ' support lines each');
  head.push('#  GREEN = support   RED = resistance');
  head.push('#  Apply as a chart study; it draws the correct levels per symbol.');
  head.push('# ===================================================================');
  head.push('');
  head.push('#  Right-axis price tags show natively (like a drawn horizontal line).');
  head.push('#  Set showLabels = no for that clean look with no name bubbles.');
  head.push('');
  head.push('input showLabels = yes;    # name + price bubbles on the line (no = native tags only)');
  head.push('input labelsOnLeft = yes;  # yes = far-left bar, no = current (right) bar');
  head.push('');
  head.push('def labelBar = if labelsOnLeft then BarNumber() == 1');
  head.push('              else (!IsNaN(close) and IsNaN(close[-1]));');
  head.push('');

  const blocks: string[] = [];
  for (let r = 0; r < maxRes; r++) {
    const p = buildPlot('R' + (r + 1), 'Color.RED', 1, rows, 'res', r);
    if (p) blocks.push(p);
  }
  for (let s = 0; s < maxSup; s++) {
    const p = buildPlot('S' + (s + 1), 'Color.GREEN', 1, rows, 'sup', s);
    if (p) blocks.push(p);
  }

  return head.join('\n') + blocks.join('\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// Scoped styles — everything lives under #tos-app so it can't leak into (or
// inherit from) the surrounding site chrome.
// ---------------------------------------------------------------------------

const STYLES = `
#tos-app {
  color-scheme: light dark;
  --bg: #f4f6f8; --panel: #ffffff; --panel-2: #eef1f4; --border: #d7dde3;
  --text: #1a2029; --muted: #5c6675; --accent: #2f6fe0; --accent-ink: #ffffff;
  --support: #128a4b; --support-soft: #e2f3e8; --resist: #cc2f36; --resist-soft: #fbe6e7;
  --mono: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  margin: 0;
  font-family: var(--sans);
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  line-height: 1.45;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
@media (prefers-color-scheme: dark) {
  #tos-app {
    --bg: #0c0f14; --panel: #12161d; --panel-2: #171c25; --border: #262d38;
    --text: #d6dde6; --muted: #8792a1; --accent: #4b8bff; --accent-ink: #08111f;
    --support: #3fd07f; --support-soft: #10241a; --resist: #ff5f64; --resist-soft: #2a1416;
  }
}
#tos-app[data-theme="light"] {
  color-scheme: light;
  --bg: #f4f6f8; --panel: #ffffff; --panel-2: #eef1f4; --border: #d7dde3;
  --text: #1a2029; --muted: #5c6675; --accent: #2f6fe0; --accent-ink: #ffffff;
  --support: #128a4b; --support-soft: #e2f3e8; --resist: #cc2f36; --resist-soft: #fbe6e7;
}
#tos-app[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0c0f14; --panel: #12161d; --panel-2: #171c25; --border: #262d38;
  --text: #d6dde6; --muted: #8792a1; --accent: #4b8bff; --accent-ink: #08111f;
  --support: #3fd07f; --support-soft: #10241a; --resist: #ff5f64; --resist-soft: #2a1416;
}
#tos-app * { box-sizing: border-box; }

#tos-app .head {
  display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;
  padding: 18px 22px; border-bottom: 1px solid var(--border); background: var(--panel);
}
#tos-app .head h1 { font-size: 16px; font-weight: 650; margin: 0; letter-spacing: -0.01em; }
#tos-app .sub { font-size: 12.5px; color: var(--muted); }
#tos-app .legend {
  margin-left: auto; display: flex; gap: 16px; font-size: 12px;
  color: var(--muted); align-items: center;
}
#tos-app .swatch { display: inline-flex; align-items: center; gap: 6px; }
#tos-app .dot { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }
#tos-app .dot.g { background: var(--support); }
#tos-app .dot.r { background: var(--resist); }

#tos-app main {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); flex: 1; min-height: 0;
}
@media (max-width: 820px) { #tos-app main { grid-template-columns: 1fr; } }

#tos-app .pane { background: var(--panel); display: flex; flex-direction: column; min-width: 0; }
#tos-app .pane-head {
  display: flex; align-items: center; gap: 10px; padding: 11px 16px;
  border-bottom: 1px solid var(--border); background: var(--panel-2);
}
#tos-app .pane-head .label {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.09em;
  color: var(--muted); font-weight: 600;
}
#tos-app .pane-head .count { font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
#tos-app .pane-head .spacer { margin-left: auto; }

#tos-app textarea, #tos-app pre {
  flex: 1; margin: 0; border: 0; padding: 16px; font-family: var(--mono);
  font-size: 13px; line-height: 1.6; background: transparent; color: var(--text);
  resize: none; tab-size: 4;
}
#tos-app textarea { outline: none; width: 100%; }
#tos-app textarea:focus { background: color-mix(in srgb, var(--accent) 4%, transparent); }
#tos-app pre { overflow: auto; white-space: pre; }

#tos-app button {
  font-family: var(--sans); font-size: 12.5px; font-weight: 600;
  border: 1px solid var(--border); background: var(--panel); color: var(--text);
  padding: 6px 12px; border-radius: 6px; cursor: pointer;
  transition: background .12s, border-color .12s, transform .06s;
}
#tos-app button:hover { border-color: var(--accent); }
#tos-app button:active { transform: translateY(1px); }
#tos-app button.primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
#tos-app button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

#tos-app .errors {
  margin: 0; padding: 8px 16px; font-family: var(--mono); font-size: 12px;
  color: var(--resist); background: var(--resist-soft); border-top: 1px solid var(--border);
}
#tos-app .errors code { color: var(--resist); font-weight: 600; }

#tos-app .foot {
  padding: 10px 16px; font-size: 12px; color: var(--muted);
  border-top: 1px solid var(--border); background: var(--panel-2);
}
#tos-app .foot b { color: var(--text); font-weight: 600; }
#tos-app .foot code { font-family: var(--mono); background: var(--bg); padding: 1px 5px; border-radius: 4px; }

#tos-app .toast {
  position: fixed; bottom: 22px; left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--text); color: var(--bg); padding: 9px 18px; border-radius: 8px;
  font-size: 13px; font-weight: 600; opacity: 0; pointer-events: none; z-index: 10;
  transition: opacity .18s, transform .18s;
}
#tos-app .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
@media (prefers-reduced-motion: reduce) { #tos-app *, #tos-app button { transition: none !important; } }
`;

const PLACEHOLDER =
  '$AAPL 317 325 332 / 311 297 288\n' +
  '$NVDA 211 218 225 / 197 191 188\n\n' +
  'Format:  $TICKER  r1 r2 r3  /  s1 s2 s3\n' +
  '(numbers before / = resistance, after / = support)';

type Theme = 'light' | 'dark' | null;

export default function TosGenerator() {
  const [value, setValue] = useState('');
  const [theme, setTheme] = useState<Theme>(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const parsed = useMemo(() => parse(value), [value]);
  const output = useMemo(() => generate(parsed.rows), [parsed.rows]);

  const inCount = parsed.rows.length
    ? parsed.rows.length + (parsed.rows.length === 1 ? ' ticker' : ' tickers')
    : '';
  const outCount = parsed.rows.length ? 'ready' : '';

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1600);
  }

  function copy() {
    if (parsed.rows.length === 0) {
      showToast('Nothing to copy yet');
      return;
    }
    navigator.clipboard.writeText(output).then(
      () => showToast('Copied to clipboard'),
      () => {
        // fallback for older / insecure contexts
        const node = preRef.current;
        if (!node) {
          showToast('Copy failed — select manually');
          return;
        }
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        try {
          document.execCommand('copy');
          showToast('Copied to clipboard');
        } catch {
          showToast('Copy failed — select manually');
        }
      },
    );
  }

  function toggleTheme() {
    setTheme((cur) => {
      const isDark = cur
        ? cur === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDark ? 'light' : 'dark';
    });
  }

  return (
    <div id="tos-app" data-theme={theme ?? undefined}>
      <style>{STYLES}</style>

      <header className="head">
        <h1>TOS Level Script Generator</h1>
        <span className="sub">Paste tickers → thinkScript study drawing support &amp; resistance lines</span>
        <div className="legend">
          <span className="swatch"><span className="dot g" /> support (below)</span>
          <span className="swatch"><span className="dot r" /> resistance (above)</span>
          <button onClick={toggleTheme} title="Toggle theme" style={{ padding: '5px 9px' }}>◐</button>
        </div>
      </header>

      <main>
        <section className="pane">
          <div className="pane-head">
            <span className="label">Input</span>
            <span className="count">{inCount}</span>
            <span className="spacer" />
            <button onClick={() => setValue(SAMPLE)}>Load sample</button>
            <button onClick={() => setValue('')}>Clear</button>
          </div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            placeholder={PLACEHOLDER}
          />
          {parsed.errors.length > 0 && (
            <div className="errors">
              {parsed.errors.map((e, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  line {e.line}: {e.msg} — <code>{e.text}</code>
                </React.Fragment>
              ))}
            </div>
          )}
        </section>

        <section className="pane">
          <div className="pane-head">
            <span className="label">thinkScript</span>
            <span className="count">{outCount}</span>
            <span className="spacer" />
            <button className="primary" onClick={copy}>Copy script</button>
          </div>
          <pre ref={preRef}>{output}</pre>
          <div className="foot">
            <b>How to use:</b> In ThinkOrSwim, open a chart → <b>Studies → Edit Studies → Create</b>, paste this
            in, name it e.g. <code>Levels</code>, and apply it to your grid. It plots the right lines automatically
            per symbol via <code>GetSymbol()</code>. Reloading the study replaces its old lines — <b>note:</b>{' '}
            thinkScript can&apos;t erase manually-drawn drawings, only its own study plots.
          </div>
        </section>
      </main>

      <div className={'toast' + (toast ? ' show' : '')}>{toast || ' '}</div>
    </div>
  );
}
