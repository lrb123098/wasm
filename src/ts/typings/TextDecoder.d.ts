
type TextDecodeOptions = {};

declare class TextDecoder {
	public readonly encoding: string;
	public readonly fatal: boolean;
	public readonly ignoreBOM: boolean;

	constructor(utfLabel?: string);
	public decode(buffer?: ArrayBuffer | ArrayBufferView, options?: TextDecodeOptions): string;
}