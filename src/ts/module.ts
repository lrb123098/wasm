import { MemoryManager } from "./memory";

export abstract class Module {
	protected readonly name: string;
	protected readonly initialMemory: number;
	protected readonly imports: {};
	protected module: WebAssembly.Module;
	protected instance: WebAssembly.Instance;
	protected memoryManager: MemoryManager;
	
	constructor(name: string, initialMemory: number, customImports?: {}) {
		this.name = name;
		this.initialMemory = initialMemory;
		this.imports = {};
		
		if (customImports) this.imports = { ...this.imports, ...customImports };
	}
	
	public run(): Promise<boolean> {
		return fetch(`${this.name}.wasm`)
			.then((response: Response) => response.arrayBuffer())
			.then((buffer: ArrayBuffer) => WebAssembly.compile(buffer))
			.then((module: WebAssembly.Module) => {
				const imports = {
					env: {
						memoryBase: 0,
						tableBase: 0,
						memory: new WebAssembly.Memory({ initial: this.initialMemory }),
						table: new WebAssembly.Table({ element: "anyfunc", initial: 0 })
					}
				};
				
				Object
					.keys(this.imports)
					.forEach((key: string) => {
						imports.env[`_${key}`] = this.imports[key];
					});
				
				this.module = module;
				this.memoryManager = new MemoryManager(imports.env.memory, imports.env.table);
				
				return WebAssembly.instantiate(module, imports);
			})
			.then((instance: WebAssembly.Instance) => {
				this.instance = instance;
				this.memoryManager.resetByteOffset();
				return true;
			})
			.catch((error: any) => {
				console.error(error);
				return false;
			});
	}
	
	protected callExport(exportName: string, ...params: number[]): void {
		this.memoryManager.setStaticBuffer();
		this.instance.exports[`_${exportName}`](...params);
		this.memoryManager.unsetStaticBuffer();
	}
}