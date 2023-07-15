
declare namespace WebAssembly {
	type Exports = {};
	type Imports = {};

	function compile(bufferSource: ArrayBuffer, importObject?: Imports): Promise<Module>;
	function instantiate(bufferSource: ArrayBuffer, importObject?: Imports): Promise<{ module: Module, instance: Instance }>;
	function instantiate(module: Module, importObject?: Imports): Promise<Instance>;
	function validate(bufferSource: ArrayBuffer): boolean;

	class Module {
		constructor(bufferSource: ArrayBuffer);
		public customSelections(module: Module, sectionName: string): ArrayBuffer[];
		public exports(module: Module): Imports[];
		public imports(module: Module): Exports[];
	}

	class Instance {
		public readonly exports: Exports;

		constructor(module: Module, importObject: Imports);
	}

	class Memory {
		public buffer: ArrayBuffer;

		constructor(memoryDescriptor: { initial: number, maximum?: number });
		public grow(number: number): number;
	}

	class Table {
		public length: number;

		constructor(tableDescriptor: { element: string, initial: number, maximum?: number });
		public get(index: number): Function;
		public grow(number: number): number;
		public set(index: number, value: Function): void;
	}
}