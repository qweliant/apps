import Delimeter from "@editorjs/delimiter";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Strikethrough from "@sotaproject/strikethrough";
// import LinkTool from '@editorjs/link' // need to make url fetch api;
import editorjsNestedChecklist from "@calumk/editorjs-nested-checklist";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import TextVariantTune from "@editorjs/text-variant-tune";
import Underline from "@editorjs/underline";
import DragDrop from "editorjs-drag-drop";
import edjsHTML from "editorjs-html";
import TextSpolier from "editorjs-inline-spoiler-tool";
import Undo from "editorjs-undo";
import TurndownService from "turndown";

export class BlockEditor {
  protected data: any;
  public editor: EditorJS;

  constructor(data: any) {
    this.data = data;

    const config = {
      shortcuts: {
        undo: "CMD+X",
        redo: "CMD+ALT+C",
      },
    };

    this.editor = new EditorJS({
      holder: "editor",
      // Configure the desired tools
      tools: {
        header: Header,
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: SimpleImage,
          inlineToolbar: true,
        },
        delimiter: Delimeter,
        Marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },
        textVariant: TextVariantTune,
        TextSpolier: TextSpolier,
        underline: Underline,
        quote: Quote,
        nestedchecklist: editorjsNestedChecklist,
        strikethrough: Strikethrough,
      },
      onReady: () => {
        const undo = new Undo({ editor: this.editor, config });
        new DragDrop(this.editor);
        undo.initialize(data.editorData as any);
      },

      data: data.editorData as any,
    });
  }

  /**
   * @returns {Promise<void>} - returns a promise that resolves to the saved data
   */
  public async saveData() {
    const savedData = await this.editor.save();
    return savedData;
  }

  /**
   *
   * @returns {Promise<void>} - returns a promise that resolves to a markdown blob file
   */
  public async exportToMarkdown() {
    const outputData = await this.saveData();
    const edjsParser = edjsHTML();
    let html: string[];
    let markdown: any;
    html = edjsParser.parse(outputData);

    try {
      const turndownService = new TurndownService();
      markdown = await turndownService.turndown(html.toString());

      var file = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      // a.download = 'oupuit.md';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    } catch (e) {
      alert(e);
    }
  }
}
