import { Injectable, signal, computed, effect } from '@angular/core';

const STORAGE_KEY = 'kadabra-theme';
const DARK_CLASS = 'dark';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.readInitialTheme());

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle(DARK_CLASS, dark);
      try {
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      } catch {
        // Modo privado / storage bloqueado: el tema sigue funcionando en memoria.
      }
    });
  }

  toggle(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private readInitialTheme(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      // Compatibilidad con la clave que usaba la version anterior del toggle.
      if (localStorage.getItem('darkMode') === 'true') {
        return 'dark';
      }
    } catch {
      // Si no hay storage, se usa la preferencia del sistema.
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
