import { writable } from 'svelte/store';
import type EditorJS from '@editorjs/editorjs';

export const editorStore = writable({} as EditorJS);
