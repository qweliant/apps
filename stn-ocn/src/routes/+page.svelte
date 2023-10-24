<script lang="ts">
	import Delimeter from '@editorjs/delimiter';
	import EditorJS from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import List from '@editorjs/list';
	import SimpleImage from '@editorjs/simple-image';
	import Strikethrough from '@sotaproject/strikethrough';
	// import LinkTool from '@editorjs/link' need to make url fetch api;
	import editorjsNestedChecklist from '@calumk/editorjs-nested-checklist';
	import Marker from '@editorjs/marker';
	import Quote from '@editorjs/quote';
	import TextVariantTune from '@editorjs/text-variant-tune';
	import Underline from '@editorjs/underline';
	import DragDrop from 'editorjs-drag-drop';
	import edjsHTML from 'editorjs-html';
	import TextSpolier from 'editorjs-inline-spoiler-tool';
	import Undo from 'editorjs-undo';
	import { onDestroy, onMount } from 'svelte';
	import TurndownService from 'turndown';
	import { editorStore } from '../store';

	export let data;
	let editor: EditorJS;

	onMount(async () => {
		const config = {
			shortcuts: {
				undo: 'CMD+X',
				redo: 'CMD+ALT+C'
			}
		};
		editor = new EditorJS({
			holder: 'editor',
			// Configure the desired tools
			tools: {
				header: Header,
				list: {
					class: List,
					inlineToolbar: true
				},
				image: {
					class: SimpleImage,
					inlineToolbar: true
				},
				delimiter: Delimeter,
				Marker: {
					class: Marker,
					shortcut: 'CMD+SHIFT+M'
				},
				textVariant: TextVariantTune,
				TextSpolier: TextSpolier,
				underline: Underline,
				quote: Quote,
				nestedchecklist: editorjsNestedChecklist,
				strikethrough: Strikethrough
			},
			onReady: () => {
				const undo = new Undo({ editor, config });
				new DragDrop(editor);
				undo.initialize(data.editorData as any);
			},

			data: data.editorData as any
		});
		$editorStore = editor;
	});

	async function saveNewContent() {
		try {
			$editorStore = editor;
			const outputData = await $editorStore.save();
			await fetch('/api/note', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: data.id, outputData })
			});
		} catch (e) {
			console.log(e);
		}
	}

	let html: string[];
	let markdown: any;
	async function downloadContent() {
		const outputData = await $editorStore.save();
		const edjsParser = edjsHTML();

		html = edjsParser.parse(outputData);
		try {
			const turndownService = new TurndownService();
			markdown = await turndownService.turndown(html.toString());

			var file = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
			var a = document.createElement('a'),
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

	// Destroy the editor instance when the component is unmounted
	onDestroy(() => {
		// $editorStore?.destroy();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="note" />
</svelte:head>

<div>
	<h1>The Only Note</h1>
	<section>
		<button on:click={() => saveNewContent()}>Save</button>
		<button on:click={() => downloadContent()}>Export To Markdown</button>
	</section>
	<div>
		{#if $editorStore}
			<!-- <div on:input={async () => await saveNewContent()} id="editor" /> -->
			<div>
				<div on:input={async () => await saveNewContent()} id="editor" />
			</div>
		{/if}
	</div>
	<section>
		<button on:click={() => saveNewContent()}>Save</button>
	</section>
</div>

<style>
	section {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		padding: 20px;
	}
	button {
		padding: 5px;
		margin: 10px;
	}
	h1 {
		width: 100%;
	}

	#editor {
		border: 1px solid #ccc;
		padding: 10px;
	}
</style>
