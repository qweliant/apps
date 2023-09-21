<script lang="ts">
	import EditorJS from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import List from '@editorjs/list';
	import SimpleImage from '@editorjs/simple-image';
	import { onDestroy, onMount } from 'svelte';
	import { editorStore } from '../store';

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
			console.log($editorStore);
		} catch (e) {
			console.log(e);
		}
	}

	// Destroy the editor instance when the component is unmounted
	onDestroy(() => {
		$editorStore?.destroy();
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
	</section>
	<section>
		{#if $editorStore}
			<!-- <div on:input={async () => await saveNewContent()} id="editor" /> -->
			<div>
				<div on:input={async () => await saveNewContent()} id="editor" />
			</div>
		{/if}
	</section>
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
