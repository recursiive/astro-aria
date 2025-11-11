/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    showLoadingScreen?: () => void;
    hideLoadingScreen?: () => void;
  }
}

export {};