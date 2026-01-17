

const Vibrant = require("node-vibrant");

export interface ExtractedColors {
    backgroundColor: string;
    textColor: string;
}

export class ColorExtractionService {

    async extractColorsFromImage(imageBuffer: Buffer): Promise<ExtractedColors> {
        try {
            const palette = await Vibrant.from(imageBuffer).getPalette();

            const backgroundColor =
                palette.Vibrant?.hex ||
                palette.DarkVibrant?.hex ||
                palette.Muted?.hex ||
                palette.DarkMuted?.hex ||
                palette.LightVibrant?.hex ||
                "#3B82F6";

            const textColor = this.getContrastColor(backgroundColor);

            return {
                backgroundColor,
                textColor,
            };
        } catch (error) {
            console.error("Error extracting colors from image:", error);
            return {
                backgroundColor: "#3B82F6",
                textColor: "#FFFFFF",
            };
        }
    }

    private getContrastColor(hexColor: string): string {
        const hex = hexColor.replace(/^#/, "");

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? "#000000" : "#FFFFFF";
    }

    isValidHexColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

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
