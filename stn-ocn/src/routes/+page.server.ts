// src/routes/+page.server.ts

import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	// 1.
	const response = await prisma.noteData.findFirst({
		where: {
			version: '2.27.0'
		}
	});
	console.log(response);
	// 2.
	return { response };
}) satisfies PageServerLoad;
