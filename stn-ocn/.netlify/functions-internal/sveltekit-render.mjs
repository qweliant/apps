import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.98661f64.js","app":"_app/immutable/entry/app.b0e54f70.js","imports":["_app/immutable/entry/start.98661f64.js","_app/immutable/chunks/scheduler.de5597d1.js","_app/immutable/chunks/singletons.73f54f2a.js","_app/immutable/entry/app.b0e54f70.js","_app/immutable/chunks/scheduler.de5597d1.js","_app/immutable/chunks/index.b750438f.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js')),
			__memo(() => import('../server/nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/note",
				pattern: /^\/api\/note\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/note/_server.ts.js'))
			},
			{
				id: "/strong",
				pattern: /^\/strong\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})());
