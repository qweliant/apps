

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/strong/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.51c43883.js","_app/immutable/chunks/scheduler.de5597d1.js","_app/immutable/chunks/index.b750438f.js"];
export const stylesheets = [];
export const fonts = [];
