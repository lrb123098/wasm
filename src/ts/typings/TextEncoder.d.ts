
type TextEncodeOptions = {};

declare class TextEncoder {
	public readonly encoding: string;

	public encode(buffer: string, options?: TextEncodeOptions): Uint8Array;
}