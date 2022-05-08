declare module "https://" {
    const a: any;
    export default a;
}
declare module "colorthief" {
    export type ColorHex = [number, number, number];
    export default class {
        constructor(): void;
        getColor(input: HTMLImageElement, quality?: number): ColorHex;
        getPalette(
            input: HTMLImageElement,
            colorCount?: number,
            quality?: number
        ): ColorHex[];
    }
}
