/**
 * Theme utility functions for color manipulation and CSS variable management
 */

/**
 * Converts hex color to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/**
 * Converts HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x;
    }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate color shades from base color
 */
export function generateColorShades(baseColor: string): Record<string, string> {
    const hsl = hexToHSL(baseColor);

    return {
        50: hslToHex(hsl.h, hsl.s, 95),
        100: hslToHex(hsl.h, hsl.s, 90),
        200: hslToHex(hsl.h, hsl.s, 80),
        300: hslToHex(hsl.h, hsl.s, 70),
        400: hslToHex(hsl.h, hsl.s, 60),
        500: baseColor, // Base color
        600: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 10, 0)),
        700: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 0)),
        800: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 0)),
        900: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 40, 0)),
    };
}

/**
 * Lighten a color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
    const hsl = hexToHSL(hex);
    const newL = Math.min(100, hsl.l + percent);
    return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Darken a color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
    const hsl = hexToHSL(hex);
    const newL = Math.max(0, hsl.l - percent);
    return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Validate hex color format
 */
export function isValidHexColor(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Apply theme colors to CSS variables
 */
export function applyThemeColors(baseColor: string): void {
    if (!isValidHexColor(baseColor)) {
        console.error('Invalid hex color format');
        return;
    }

    const root = document.documentElement;
    const shades = generateColorShades(baseColor);

    // Set primary color and its shades
    root.style.setProperty('--color-primary', baseColor);
    root.style.setProperty('--color-primary-light', lightenColor(baseColor, 10));
    root.style.setProperty('--color-primary-dark', darkenColor(baseColor, 10));

    // Set all shades
    Object.entries(shades).forEach(([shade, color]) => {
        root.style.setProperty(`--color-primary-${shade}`, color);
    });
}

/**
 * Reset theme colors to default
 */
export function resetThemeColors(): void {
    applyThemeColors('#3B82F6'); // Default blue
}

/**
 * Predefined color palette for quick selection
 */
export const THEME_COLOR_PALETTE = [
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Red', color: '#EF4444' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Teal', color: '#14B8A6' },
    { name: 'Indigo', color: '#6366F1' },
];
