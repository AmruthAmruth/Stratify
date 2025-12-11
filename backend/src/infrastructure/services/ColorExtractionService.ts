import * as Vibrant from "node-vibrant";

export interface ExtractedColors {
    backgroundColor: string;
    textColor: string;
}

export class ColorExtractionService {
    /**
     * Extract theme colors from an image buffer
     * @param imageBuffer - Buffer containing the image data
     * @returns Object with backgroundColor and textColor
     */
    async extractColorsFromImage(imageBuffer: Buffer): Promise<ExtractedColors> {
        try {
            // Extract color palette using Vibrant
            const palette = await Vibrant.from(imageBuffer).getPalette();

            // Priority order: Vibrant > DarkVibrant > Muted > DarkMuted > LightVibrant
            const backgroundColor =
                palette.Vibrant?.hex ||
                palette.DarkVibrant?.hex ||
                palette.Muted?.hex ||
                palette.DarkMuted?.hex ||
                palette.LightVibrant?.hex ||
                "#3B82F6"; // Fallback to default blue

            // Calculate contrasting text color
            const textColor = this.getContrastColor(backgroundColor);

            return {
                backgroundColor,
                textColor,
            };
        } catch (error) {
            console.error("Error extracting colors from image:", error);
            // Return default colors on error
            return {
                backgroundColor: "#3B82F6",
                textColor: "#FFFFFF",
            };
        }
    }

    /**
     * Calculate contrasting text color (black or white) based on background luminance
     * @param hexColor - Background color in hex format
     * @returns "#000000" or "#FFFFFF"
     */
    private getContrastColor(hexColor: string): string {
        // Remove # if present
        const hex = hexColor.replace(/^#/, "");

        // Convert to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calculate relative luminance (WCAG formula)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Return black for light backgrounds, white for dark backgrounds
        return luminance > 0.5 ? "#000000" : "#FFFFFF";
    }

    /**
     * Validate hex color format
     * @param color - Color string to validate
     * @returns true if valid hex color
     */
    isValidHexColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    /**
     * Extract colors from image URL
     * @param imageUrl - URL of the image
     * @returns Object with backgroundColor and textColor
     */
    async extractColorsFromUrl(imageUrl: string): Promise<ExtractedColors> {
        try {
            const palette = await Vibrant.from(imageUrl).getPalette();

            const backgroundColor =
                palette.Vibrant?.hex ||
                palette.DarkVibrant?.hex ||
                palette.Muted?.hex ||
                "#3B82F6";

            const textColor = this.getContrastColor(backgroundColor);

            return {
                backgroundColor,
                textColor,
            };
        } catch (error) {
            console.error("Error extracting colors from URL:", error);
            return {
                backgroundColor: "#3B82F6",
                textColor: "#FFFFFF",
            };
        }
    }
}
