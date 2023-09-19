import { c as create_ssr_component, o as onDestroy } from "../../chunks/ssr.js";
import "@editorjs/editorjs";
import "@editorjs/simple-image";
import "@editorjs/header";
import "@editorjs/list";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "section.svelte-1x17gfz{display:flex;flex-direction:column;justify-content:center;align-items:center;flex:0.6}h1.svelte-1x17gfz{width:100%}#editor.svelte-1x17gfz{border:1px solid #ccc;padding:10px;text-align:left}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-iojec8_START -->${$$result.title = `<title>Home</title>`, ""}<meta name="description" content="note"><!-- HEAD_svelte-iojec8_END -->`, ""} <section class="svelte-1x17gfz"><h1 class="svelte-1x17gfz" data-svelte-h="svelte-h32aat">The Only Note</h1> <section class="svelte-1x17gfz"><button data-svelte-h="svelte-br6zj6">Save</button></section> <div id="editor" class="svelte-1x17gfz"></div> </section>`;
});
export {
  Page as default
};
