import { writable } from "svelte/store";

// background grid on by default
export const showGrid  = writable(true);

// matrix mode off by default
export const matrixMode = writable(false) 