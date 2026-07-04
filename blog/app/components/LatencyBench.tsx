"use client";

/**
 * <LatencyBench /> — an in-page, interactive version of the prosemirror-pretext
 * latency benchmark. Same ProseMirror document & transactions drive two editors:
 *
 *   - prosemirror-view  → contenteditable DOM   (the control)
 *   - prosemirror-pretext → <canvas>            (this project)
 *
 * Press "Race": it types into the *middle* of both documents and, each
 * keystroke, reads the caret's pixel position (what a bubble menu / collab
 * cursor does). It charts the per-keystroke "edit → read caret" latency. Crank
 * the document size up and the DOM line climbs while the canvas line stays flat.
 *
 * Caveat shown in the UI: this runs unthrottled on *your* machine, so small
 * documents look like a tie. The reproducible, CPU-throttled numbers are in the
 * repo's bench/.
 */
import { useEffect, useRef, useState } from "react";
import { Schema, type NodeSpec, type Node as PMNode } from "prosemirror-model";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { CanvasEditor } from "prosemirror-pretext";

const nodes: Record<string, NodeSpec> = {
  doc: { content: "block+" },
  paragraph: { group: "block", content: "text*", toDOM: () => ["p", 0], parseDOM: [{ tag: "p" }] },
  text: { group: "inline" },
};
const schema = new Schema({ nodes });

const SENTENCE =
  "The quick brown fox jumps over the lazy dog, and then keeps right on going. ";

function buildDoc(n: number): PMNode {
  const blocks: PMNode[] = [schema.node("paragraph", null, [schema.text("Type in the middle of a long document.")])];
  for (let i = 0; i < n; i++)
    blocks.push(schema.node("paragraph", null, [schema.text(`${i}. ${SENTENCE}`)]));
  return schema.node("doc", null, blocks);
}

interface Adapter {
  setCaret(pos: number): void;
  type(): void;
  readCaret(): void;
  destroy(): void;
}

function domAdapter(doc: PMNode, mount: HTMLElement): Adapter {
  const view = new EditorView(mount, { state: EditorState.create({ doc, schema }) });
  return {
    setCaret(pos) {
      view.dispatch(view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(pos))));
    },
    type() { view.dispatch(view.state.tr.insertText("a")); },
    readCaret() { view.coordsAtPos(view.state.selection.head); },
    destroy() { view.destroy(); },
  };
}

function canvasAdapter(doc: PMNode, mount: HTMLElement, width: number): Adapter {
  const editor = new CanvasEditor({
    state: EditorState.create({ doc, schema }),
    container: mount,
    width,
    font: '15px Georgia, serif',
    lineHeight: 24,
    autofocus: false,
    // Virtualized viewport — keeps the canvas a sane size at large doc counts.
    // Fast caret reads under virtualization require prosemirror-pretext >= 0.1.3.
    maxHeight: 220,
  });
  return {
    setCaret(pos) {
      editor.dispatch(editor.state.tr.setSelection(TextSelection.near(editor.state.doc.resolve(pos))));
    },
    type() { editor.dispatch(editor.state.tr.insertText("a")); },
    readCaret() { editor.coordsAtPos(editor.state.selection.head); },
    destroy() { editor.destroy(); },
  };
}

const SIZES = [200, 1000, 3000] as const;
const KEYSTROKES = 200;
const p50 = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

function Sparkline({ data, max, color }: { data: number[]; max: number; color: string }) {
  const W = 240, H = 48;
  const pts = data.length
    ? data.map((v, i) => `${(i / Math.max(1, KEYSTROKES - 1)) * W},${H - Math.min(1, v / max) * H}`).join(" ")
    : "";
  return (
    <svg width={W} height={H} className="lb-spark" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

export default function LatencyBench() {
  const domHost = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const adapters = useRef<{ dom: Adapter; canvas: Adapter } | null>(null);

  const [size, setSize] = useState<number>(1000);
  const [readCaret, setReadCaret] = useState(true);
  const [running, setRunning] = useState(false);
  const [dom, setDom] = useState<{ spark: number[]; p50: number }>({ spark: [], p50: 0 });
  const [canvas, setCanvas] = useState<{ spark: number[]; p50: number }>({ spark: [], p50: 0 });

  // (Re)mount both editors whenever the document size changes.
  useEffect(() => {
    const dh = domHost.current!, ch = canvasHost.current!;
    let cancelled = false;
    (async () => {
      await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
      if (cancelled) return;
      dh.innerHTML = ""; ch.innerHTML = "";
      const doc = buildDoc(size);
      const width = Math.max(280, Math.min(460, ch.clientWidth - 4 || 420));
      adapters.current = { dom: domAdapter(doc, dh), canvas: canvasAdapter(doc, ch, width) };
      setDom({ spark: [], p50: 0 });
      setCanvas({ spark: [], p50: 0 });
    })();
    return () => {
      cancelled = true;
      adapters.current?.dom.destroy();
      adapters.current?.canvas.destroy();
      adapters.current = null;
    };
  }, [size]);

  async function race() {
    const a = adapters.current;
    if (!a || running) return;
    setRunning(true);
    const caret = Math.floor(buildDoc(size).content.size / 2);
    const out: Record<"dom" | "canvas", number[]> = { dom: [], canvas: [] };
    for (const key of ["dom", "canvas"] as const) {
      const ad = a[key];
      ad.setCaret(caret);
      // warmup
      for (let i = 0; i < 15; i++) { ad.type(); if (readCaret) ad.readCaret(); }
      const samples: number[] = [];
      for (let i = 0; i < KEYSTROKES; i++) {
        const t0 = performance.now();
        ad.type();
        if (readCaret) ad.readCaret();
        samples.push(performance.now() - t0);
        // Yield every so often so the sparkline animates as the race runs.
        if (i % 8 === 0) {
          const snap = [...samples];
          if (key === "dom") setDom({ spark: snap, p50: p50(snap) });
          else setCanvas({ spark: snap, p50: p50(snap) });
          await new Promise((r) => requestAnimationFrame(() => r(null)));
        }
      }
      out[key] = samples;
      if (key === "dom") setDom({ spark: samples, p50: p50(samples) });
      else setCanvas({ spark: samples, p50: p50(samples) });
    }
    setRunning(false);
  }

  const max = Math.max(0.5, dom.p50, canvas.p50, ...dom.spark, ...canvas.spark);
  const ratio = canvas.p50 >= 0.02 ? (dom.p50 / canvas.p50).toFixed(1) + "×" : "—";

  return (
    <div className="lb-wrap not-prose">
      <div className="lb-controls">
        <span className="lb-label">document size</span>
        {SIZES.map((s) => (
          <button key={s} className={`lb-btn ${size === s ? "lb-on" : ""}`} disabled={running} onClick={() => setSize(s)}>
            {s.toLocaleString()}
          </button>
        ))}
        <label className="lb-check">
          <input type="checkbox" checked={readCaret} disabled={running} onChange={(e) => setReadCaret(e.target.checked)} />
          read caret each keystroke
        </label>
        <button className="lb-run" disabled={running} onClick={race}>
          {running ? "racing…" : `Race (${KEYSTROKES}×)`}
        </button>
      </div>

      <div className="lb-grid">
        <div className="lb-panel">
          <div className="lb-head"><span className="lb-dot" style={{ background: "#d2691e" }} />prosemirror-view (DOM)</div>
          <div ref={domHost} className="lb-editor lb-dom" />
          <Sparkline data={dom.spark} max={max} color="#d2691e" />
          <div className="lb-stat">p50 <b>{dom.p50.toFixed(2)} ms</b>/keystroke</div>
        </div>
        <div className="lb-panel">
          <div className="lb-head"><span className="lb-dot" style={{ background: "#4f9e2c" }} />prosemirror-pretext (canvas)</div>
          <div ref={canvasHost} className="lb-editor" />
          <Sparkline data={canvas.spark} max={max} color="#4f9e2c" />
          <div className="lb-stat">p50 <b>{canvas.p50.toFixed(2)} ms</b>/keystroke{ratio !== "—" && <> · canvas <b>{ratio}</b> faster</>}</div>
        </div>
      </div>

      <p className="lb-note">
        Unthrottled, on your machine — small documents look like a tie. Crank the
        size up and read-after-write on. The reproducible, CPU-throttled numbers
        live in the <a href="https://github.com/qweliant/prosemirror-pretext/tree/main/bench">repo&rsquo;s bench/</a>.
      </p>

      <style>{`
        .lb-wrap { border: 2px solid #4f9e2c; border-radius: 16px; padding: 14px; background: #fbfff5; margin: 1.5rem 0; }
        .lb-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 12px; }
        .lb-label { font: 600 12px/1 ui-sans-serif, system-ui; color: #2f6e1c; text-transform: uppercase; letter-spacing: .04em; }
        .lb-btn, .lb-run { font: 600 13px/1 ui-sans-serif, system-ui; height: 30px; padding: 0 11px; border: 1.5px solid #4f9e2c; border-radius: 8px; background: #fff; color: #2f6e1c; cursor: pointer; }
        .lb-btn.lb-on { background: #7ec14b; color: #fff; }
        .lb-run { margin-left: auto; background: #4f9e2c; color: #fff; }
        .lb-run:disabled, .lb-btn:disabled { opacity: .5; cursor: default; }
        .lb-check { font: 13px/1 ui-sans-serif, system-ui; color: #2f6e1c; display: inline-flex; align-items: center; gap: 5px; }
        .lb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 640px) { .lb-grid { grid-template-columns: 1fr; } }
        .lb-panel { background: #fff; border-radius: 10px; padding: 10px; min-width: 0; }
        .lb-head { font: 600 12px/1 ui-sans-serif, system-ui; color: #1b2a16; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .lb-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .lb-editor { height: 220px; overflow: auto; border: 1px solid #e3efda; border-radius: 6px; }
        .lb-editor .ProseMirror { outline: none; white-space: pre-wrap; font: 15px/1.6 Georgia, serif; padding: 8px; }
        .lb-spark { display: block; margin: 8px 0 4px; width: 100%; }
        .lb-stat { font: 12px/1.4 ui-sans-serif, system-ui; color: #3a4a2e; }
        .lb-note { font: 12px/1.5 ui-sans-serif, system-ui; color: #6a7a5c; margin: 12px 2px 0; }
        .lb-note a { color: #2f6e1c; }
      `}</style>
    </div>
  );
}
