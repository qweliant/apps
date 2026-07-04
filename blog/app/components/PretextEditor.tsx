"use client";

/**
 * A live <prosemirror-pretext> editor you can drop into any MDX post:
 *
 *   import PretextEditor from "@/app/components/PretextEditor";
 *   <PretextEditor />
 *
 * Canvas-rendered (no contenteditable). Client-only — it mounts in an effect
 * after fonts load, and tears down on unmount.
 */
import { useEffect, useRef } from "react";
import { Schema, type NodeSpec, type MarkType } from "prosemirror-model";
import { EditorState, type Command } from "prosemirror-state";
import { toggleMark, setBlockType } from "prosemirror-commands";
import { history, undo, redo } from "prosemirror-history";
import { wrapInList, liftListItem } from "prosemirror-schema-list";
import { CanvasEditor, markSpecs, buildMarkKeymap } from "prosemirror-pretext";

const FONT = '16px Georgia, "Times New Roman", serif';

const nodes: Record<string, NodeSpec> = {
  doc: { content: "(heading | paragraph | blockquote | code_block | bullet_list)+" },
  paragraph: { content: "text*", toDOM: () => ["p", 0], parseDOM: [{ tag: "p" }] },
  heading: {
    content: "text*", group: "block", attrs: { level: { default: 1 } },
    toDOM: (n) => [`h${n.attrs.level}`, 0],
    parseDOM: [1, 2, 3].map((l) => ({ tag: `h${l}`, attrs: { level: l } })),
  },
  blockquote: { content: "text*", group: "block", toDOM: () => ["blockquote", 0], parseDOM: [{ tag: "blockquote" }] },
  code_block: { content: "text*", group: "block", marks: "", code: true, toDOM: () => ["pre", ["code", 0]], parseDOM: [{ tag: "pre", preserveWhitespace: "full" }] },
  bullet_list: { content: "list_item+", group: "block", toDOM: () => ["ul", 0], parseDOM: [{ tag: "ul" }] },
  list_item: { content: "paragraph block*", defining: true, toDOM: () => ["li", 0], parseDOM: [{ tag: "li" }] },
  text: { inline: true },
};
const schema = new Schema({ nodes, marks: markSpecs });

const m = (s: string, ...marks: string[]) => schema.text(s, marks.map((n) => schema.marks[n].create()));
const li = (s: string) => schema.node("list_item", null, [schema.node("paragraph", null, [schema.text(s)])]);

function sampleDoc() {
  return schema.node("doc", null, [
    schema.node("heading", { level: 2 }, [schema.text("you're editing a <canvas> 🐸")]),
    schema.node("paragraph", null, [
      m("Every glyph is "), m("ctx.fillText()", "code"),
      m(" — there is no contenteditable here. Select some text and hit "),
      m("B", "code"), m(" / "), m("I", "code"),
      m(", make a list, or quote something. It's a real ProseMirror document; only the view layer is different."),
    ]),
    schema.node("bullet_list", null, [
      li("pure-arithmetic layout (Pretext) — zero reflows"),
      li("grapheme-aware caret, marks, lists, code blocks"),
      li("a hidden DOM mirror keeps it screen-reader accessible"),
    ]),
    schema.node("blockquote", null, [schema.text("Don't let the medium dictate a purpose for the message.")]),
  ]);
}

const markActive = (s: EditorState, t: MarkType) => {
  const { from, $from, to, empty } = s.selection;
  return empty ? !!t.isInSet(s.storedMarks || $from.marks()) : s.doc.rangeHasMark(from, to, t);
};
const blockActive = (s: EditorState, name: string, attrs?: Record<string, unknown>) =>
  s.selection.$from.parent.hasMarkup(schema.nodes[name], attrs as never);
const toggleBlock = (name: string, attrs?: Record<string, unknown>): Command => (s, d) =>
  setBlockType(blockActive(s, name, attrs) ? schema.nodes.paragraph : schema.nodes[name], blockActive(s, name, attrs) ? undefined : attrs)(s, d);
const inList = (s: EditorState) => {
  const $f = s.selection.$from;
  for (let i = $f.depth; i > 0; i--) if ($f.node(i).type === schema.nodes.bullet_list) return true;
  return false;
};

export default function PretextEditor() {
  const hostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const bar = barRef.current!;
    let editor: CanvasEditor | null = null;
    let cancelled = false;

    (async () => {
      await document.fonts.ready;
      if (cancelled) return;
      // The host may not be laid out yet (clientWidth 0); wait a frame so we
      // size the canvas to the column instead of overflowing it.
      let avail = host.clientWidth;
      if (!avail) { await new Promise((r) => requestAnimationFrame(() => r(null))); avail = host.clientWidth; }
      if (cancelled) return;
      // clientWidth includes the host's 10px padding on each side — subtract it
      // (plus a small margin) so the canvas sits *inside* the box.
      const width = Math.max(280, Math.min(680, Math.floor(avail || 600) - 24));
      host.innerHTML = "";
      bar.innerHTML = "";

      let sync = () => {};
      editor = new CanvasEditor({
        state: EditorState.create({ doc: sampleDoc(), schema, plugins: [history()] }),
        container: host,
        width,
        font: FONT,
        lineHeight: 28,
        // Don't grab focus on mount, so the post doesn't scroll to the embed.
        autofocus: false,
        ariaLabel: "Demo editor — prosemirror-pretext",
        keymap: { ...buildMarkKeymap(schema), "Mod-z": undo, "Mod-y": redo, "Shift-Mod-z": redo },
        onRender: () => sync(),
      });

      const items: { el: HTMLButtonElement; on: () => boolean }[] = [];
      const add = (label: string, cmd: Command, on: () => boolean = () => false) => {
        const el = document.createElement("button");
        el.textContent = label;
        el.className = "pe-btn";
        el.addEventListener("mousedown", (e) => { e.preventDefault(); editor!.command(cmd); });
        bar.appendChild(el);
        items.push({ el, on });
      };
      const mk = (n: string) => schema.marks[n];
      add("B", toggleMark(mk("strong")), () => markActive(editor!.state, mk("strong")));
      add("I", toggleMark(mk("em")), () => markActive(editor!.state, mk("em")));
      add("</>", toggleMark(mk("code")), () => markActive(editor!.state, mk("code")));
      add("🖍", toggleMark(mk("highlight")), () => markActive(editor!.state, mk("highlight")));
      add("H2", toggleBlock("heading", { level: 2 }), () => blockActive(editor!.state, "heading", { level: 2 }));
      add("❝", toggleBlock("blockquote"), () => blockActive(editor!.state, "blockquote"));
      add("• List", (s, d) => (inList(s) ? liftListItem(schema.nodes.list_item)(s, d) : wrapInList(schema.nodes.bullet_list)(s, d)), () => inList(editor!.state));
      add("↩︎", undo);
      add("↪︎", redo);
      sync = () => { for (const { el, on } of items) el.classList.toggle("pe-on", on()); };
      sync();
    })();

    return () => { cancelled = true; editor?.destroy(); };
  }, []);

  return (
    <div className="pe-wrap not-prose">
      <div ref={barRef} className="pe-toolbar" />
      <div ref={hostRef} className="pe-host" />
      <style>{`
        .pe-wrap { border: 2px solid #4f9e2c; border-radius: 16px; padding: 14px; background: #fbfff5; margin: 1.5rem 0; }
        .pe-toolbar { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
        .pe-btn { font: 600 13px/1 ui-sans-serif, system-ui; min-width: 32px; height: 29px; padding: 0 9px;
          border: 1.5px solid #4f9e2c; border-radius: 8px; background: #fff; color: #2f6e1c; cursor: pointer; }
        .pe-btn:hover { background: #eaffe0; }
        .pe-btn.pe-on { background: #7ec14b; color: #fff; }
        .pe-host { background: #fff; border-radius: 10px; padding: 10px; }
        .pe-host canvas { display: block; }
      `}</style>
    </div>
  );
}
