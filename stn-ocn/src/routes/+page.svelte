<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import EditorJS, { type OutputBlockData } from '@editorjs/editorjs';
	import SimpleImage from '@editorjs/simple-image';
	import Header from '@editorjs/header';
	import List from '@editorjs/list';

	export let data;
	let editor: EditorJS;

	onMount(async () => {
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
				}
			},
			data: data.editorData as any
		});
	});

	async function onSave() {
		const outputData = await editor.save();
		console.log('Siving data: ', outputData);
		try {
			await fetch('/api/note', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: data.id, outputData })
			});
			console.log('saved');
		} catch (e) {
			console.log(e);
		}
	}

	// Destroy the editor instance when the component is unmounted
	onDestroy(() => {
		editor?.destroy();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="note" />
</svelte:head>

<section>
	<h1>The Only Note</h1>
	<section>
		<button on:click={async () => await onSave()}>Save</button>
	</section>
	<div id="editor" />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	#editor {
		border: 1px solid #ccc;
		padding: 10px;
		text-align: left;
	}
</style>
