

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.7de7116f.js","_app/immutable/chunks/scheduler.de5597d1.js","_app/immutable/chunks/index.b750438f.js","_app/immutable/chunks/stores.42f680de.js","_app/immutable/chunks/singletons.73f54f2a.js"];
export const stylesheets = [];
export const fonts = [];
