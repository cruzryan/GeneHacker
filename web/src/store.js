import { writable } from 'svelte/store';


//Possible screens: "HOME", "EDITOR"
export const current_screen = writable("HOME");