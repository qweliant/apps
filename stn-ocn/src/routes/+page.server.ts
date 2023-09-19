import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const response = await prisma.noteData.findFirst({});
	console.log(response);
	return {
		editorData: {
			time: Number(response?.time),
			blocks: response?.blocks,
			version: response?.version
		},
		id: response?.id
	};
}) satisfies PageServerLoad;
