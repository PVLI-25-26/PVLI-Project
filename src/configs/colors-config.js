/**
 * Palette of named colors used across the project.
 *
 * @namespace Colors
 * @property {string} DarkBrown - Hex color string for dark brown (e.g. "#4f4a45").
 * @property {string} LightBrown - Hex color string for light brown (e.g. "#6c5f5b").
 * @property {string} Orange - Hex color string for orange (e.g. "#ed9b5c").
 * @property {string} White - Hex color string for off-white (e.g. "#c9b9a9").
 * @property {string} Green - Hex color string for green (e.g. "#80aa7a").
 * @property {string} Red - Hex color string for red (e.g. "#ba5050").
 *
 * Numeric hex variants (suffixed with "Hex") are the integer equivalents of the corresponding
 * hex color strings and are convenient for APIs that expect numeric color values.
 *
 * @property {number} DarkBrownHex
 * @property {number} LightBrownHex
 * @property {number} OrangeHex
 * @property {number} WhiteHex
 * @property {number} GreenHex
 * @property {number} RedHex
 */
const Colors = {
    DarkBrown: "#4f4a45",
    LightBrown: "#6c5f5b",
    Orange: "#ed9b5c",
    White: "#c9b9a9",
    Green: "#80aa7a",
    Red: "#ba5050"
}

/**
 * Integer value of DarkBrown (0xRRGGBB).
 * @type {number}
 */
Colors.DarkBrownHex = parseInt(Colors.DarkBrown.slice(1), 16);
/**
 * Integer value of LightBrown (0xRRGGBB).
 * @type {number}
 */
Colors.LightBrownHex = parseInt(Colors.LightBrown.slice(1), 16);
/**
 * Integer value of Orange (0xRRGGBB).
 * @type {number}
 */
Colors.OrangeHex = parseInt(Colors.Orange.slice(1), 16);
/**
 * Integer value of White (0xRRGGBB).
 * @type {number}
 */
Colors.WhiteHex = parseInt(Colors.White.slice(1), 16);
/**
 * Integer value of Green (0xRRGGBB).
 * @type {number}
 */
Colors.GreenHex = parseInt(Colors.Green.slice(1), 16);
/**
 * Integer value of Red (0xRRGGBB).
 * @type {number}
 */
Colors.RedHex = parseInt(Colors.Red.slice(1), 16);

export default Colors;