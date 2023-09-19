import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('Seeding database...');

	await prisma.noteData.create({
		data: {
			time: new Date().getTime(),
			blocks: [
				{
					id: 'Gx-BfAS80s',
					type: 'paragraph',
					data: {
						text: 'Clearly nothing is in the bin, but i will save this. And it WILL work, or else'
					}
				},
				{
					id: 'G3uzNMTT7o',
					type: 'paragraph',
					data: {
						text: '<b>Text. </b>How do I like the layout here? Do i want a side bar? Do i want to be able to create new notes?'
					}
				},
				{
					id: 'JOynxVUOe9',
					type: 'paragraph',
					data: {
						text: 'Im really digging the block and rich text editor experiance. I may want have this simple single long lived note. I can transclude blocks in others using protobuff'
					}
				},
				{
					id: 'mVV7LqL93l',
					type: 'paragraph',
					data: { text: 'For now this is nice.&nbsp;' }
				},
				{
					id: 'mttplyn7Zi',
					type: 'paragraph',
					data: {
						text: 'I def need to add a few more plugins to the editorJS object. Image, other toolbar things, an export feature,&nbsp;'
					}
				},
				{
					id: 'Sg83i8Go2S',
					type: 'paragraph',
					data: { text: 'I also may add a nav bar to facilitate this.' }
				},
				{
					id: '_muxyTFwEO',
					type: 'paragraph',
					data: {
						text: 'If i can packge up the editor and plugins i may be able to recreate a strong app clone. Thos thats not true. I just need some modal components and an API'
					}
				},
				{
					id: '6TJ2d_WG_z',
					type: 'header',
					data: {
						text: "<i>I suppose i wouldn't need to use notes on the fly. But i could see a world in which something like a content outline ends up in a note that creates a jekyll blog post. Or i could use a formatted note for writing plays and scripts. Pretty much the kind of long form writing i do in obsidian</i>",
						level: 2
					}
				},
				{ id: 'ER7LvpfEnv', type: 'paragraph', data: { text: 'wait' } },
				{ id: '4Uarjlsb5C', type: 'paragraph', data: { text: 'OPEN SCENE' } },
				{ id: 'GSd4LP3fad', type: 'paragraph', data: { text: 'dOOR' } },
				{
					id: '-42KK6lgnI',
					type: 'paragraph',
					data: {
						text: 'yEAH NO I WOULD HAVE TO WORK ON FORMATTING A DOC AS A SCREEN PLAY&nbsp;'
					}
				},
				{
					id: 'zRbAvT70KZ',
					type: 'paragraph',
					data: { text: 'I would also love a way to manage a lot of this' }
				},
				{
					id: 'kwWhoYXTca',
					type: 'paragraph',
					data: { text: 'So for starters, my inspo and tools for thought are' }
				},
				{
					id: 'cN7WsGB7xy',
					type: 'paragraph',
					data: {
						text: 'Tana - can replace with own logseq version but would absolutely need super tags and a regular as dom. if i can recreate this in a way i need i think i wouldnt need to do obsidian as well'
					}
				},
				{ id: 'OygIih_noq', type: 'paragraph', data: { text: 'Obsidian' } },
				{
					id: 'cYGbY-P_K_',
					type: 'paragraph',
					data: { text: 'Apple notes - replacement in progress' }
				},
				{
					id: 'ThvJ4aP4ZW',
					type: 'paragraph',
					data: { text: 'Email, Calendar, SMS - just use non big pltform' }
				},
				{
					id: 'ZO38PyUXay',
					type: 'paragraph',
					data: { text: 'strong - can build simple clone' }
				},
				{
					id: '3UqWn2YOnt',
					type: 'paragraph',
					data: {
						text: 'Apple watch + health monitoring - use devices i can use with an SDK. First app woulkd be a stress monitoring thing using HRV'
					}
				},
				{
					id: '3n5qrt1IZU',
					type: 'paragraph',
					data: {
						text: 'The goals for all this is to replace paid applications, make applications that can better fit my uses, improve flexibilit, align with thought processes, or use and mention data across GUI'
					}
				},
				{
					id: 'FegDXyQX2E',
					type: 'paragraph',
					data: {
						text: 'I am not sure what all those may be but i am excited for what I come up with'
					}
				},
				{
					id: 'PE1WWyUq7a',
					type: 'paragraph',
					data: { text: 'New message from build' }
				}
			],
			version: '2.27.0'
		}
	});
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
