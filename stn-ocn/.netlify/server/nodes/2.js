import * as universal from '../entries/pages/_page.ts.js';
import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.fc952cf5.js","_app/immutable/chunks/scheduler.de5597d1.js","_app/immutable/chunks/index.b750438f.js"];
export const stylesheets = ["_app/immutable/assets/2.64c8c039.css"];
export const fonts = [];
