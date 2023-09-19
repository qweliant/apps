import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function PUT(event: RequestEvent) {
	const data = await event.request.json();
	console.log(data);
	try {
		console.log('Updating db..');
		await prisma.noteData.update({
			where: {
				id: data.id
			},
			data: {
				time: String(data.outputData.time),
				blocks: data.outputData.blocks,
				version: data.outputData.version
			}
		});
		console.log('Updated db..');
	} catch (e) {
		console.log(e);
	}
	return json({ success: true });
}
