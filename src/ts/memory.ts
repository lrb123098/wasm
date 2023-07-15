import { RoundToMultiple, IsInt } from "./utils";

const enum BYTES {
	INT64 = 8,
	INT32 = 4,
	INT16 = 2,
	INT8 = 1,
	FLOAT64 = 8,
	FLOAT32 = 4,
	FLOAT16 = 2,
	FLOAT8 = 1,
	CHAR = 1,
	PTR = 4
}

class MemoryBlock {
	public readonly pointer: number;
	public readonly length: number;
	public readonly bytes: number;
	private readonly memory: WebAssembly.Memory;
	private readonly nodes: MemoryBlock[] = [];
	
	constructor(pointer: number, length: number, bytes: BYTES, memory: WebAssembly.Memory) {
		this.pointer = pointer;
		this.length = length;
		this.bytes = bytes;
		this.memory = memory;
	}
	
	public getMetadata(): number[] {
		return [this.pointer, this.length / this.bytes];
	}
	
	public free(callback?: (value: MemoryBlock) => void): void {
		const buffer = new Uint8Array(this.memory.buffer, this.pointer, this.length);
		buffer.fill(0, 0, buffer.length);
		
		if (this.nodes.length > 0) {
			this.nodes.forEach((v: MemoryBlock) => v.free(callback));
			this.nodes.splice(0, this.nodes.length);
		}
		
		if (callback) callback(this);
		
/* Iterative
		const stack: MemoryBlock[] = [this];
		
		while (stack.length > 0) {
			const block = stack.pop();
			
			if (!block) break;
			
			const buffer = new Uint8Array(this.memory.buffer, block.pointer, block.length);
			buffer.fill(0, 0, buffer.length);
			
			if (block.nodes.length > 0) {
				block.nodes.forEach((v: MemoryBlock) => stack.push(v));
				block.nodes.splice(0, block.nodes.length);
			}
			
			if (callback) callback(block);
		}
*/
	}
	
	public addNode(memoryBlock: MemoryBlock): void {
		this.nodes.push(memoryBlock);
	}
}

export class MemoryManager {
	private static buffer: ArrayBuffer;
	
	public static pointerToString(pointer: number): string {
		const buffer = new Uint8Array(MemoryManager.buffer, pointer);
		return new TextDecoder("utf8").decode(buffer.slice(0, buffer.indexOf(0)));
	}
	
	private readonly memory: WebAssembly.Memory;
	private readonly table: WebAssembly.Table;
	private readonly allocatedMemoryBlocks: Map<number, MemoryBlock> = new Map();
	private maximumByteOffset: number;
	
	constructor(memory: WebAssembly.Memory, table: WebAssembly.Table) {
		this.memory = memory;
		this.table = table;
	}
	
	public getUsage(): number {
		let usage = new Int32Array(this.memory.buffer).indexOf(0) * BYTES.PTR;
		this.allocatedMemoryBlocks.forEach((v: MemoryBlock, i: number) => {
			usage += v.length * v.bytes;
		});
		
		return usage;
	}
	
	public allocate(length: number, bytes: BYTES): MemoryBlock {
		let pointer = 0;
		
		// if (this.allocatedMemoryBlocks.size > 0) {
			
		// } else {
			pointer = this.maximumByteOffset;
		// }
		
		pointer = RoundToMultiple(pointer, bytes);
		this.maximumByteOffset = pointer + (length * bytes);
		const memoryBlock = new MemoryBlock(pointer, length * bytes, bytes, this.memory);
		this.allocatedMemoryBlocks.set(memoryBlock.pointer, memoryBlock);
		
		return memoryBlock;
	}
	
	public deallocate(memoryBlock: MemoryBlock): void {
		memoryBlock.free((v: MemoryBlock) => this.allocatedMemoryBlocks.delete(v.pointer));
	}
	
	public copyObject(object: {}, existingBlock?: MemoryBlock): MemoryBlock {
		const length = Object.keys(object).length;
		const block = existingBlock || this.allocate(length, BYTES.PTR);
		const buffer = new Uint32Array(this.memory.buffer, block.pointer, length);
		
		Object
			.keys(object)
			.forEach((v: string, i: number) => {
				let node: MemoryBlock | undefined;
				
				switch (typeof object[v]) {
					case "number": {
						this.copyNumber(object[v], block, i);
						break;
					}
					case "string": {
						node = this.copyString(object[v]);
						break;
					}
					case "object": {
						node = this.copyObject(object[v]);
						break;
					}
				}
				
				if (node) {
					buffer[i] = node.pointer;
					block.addNode(node);
				}
		});

		return block;
	}
	
	public copyString(value: string, existingBlock?: MemoryBlock): MemoryBlock {
		const block = existingBlock || this.allocate(value.length + 1, BYTES.CHAR);
		const buffer = new Uint8Array(this.memory.buffer, block.pointer, block.length);
		buffer.set(new TextEncoder().encode(value));
		buffer[buffer.length - 1] = 0;
		
		return block;
	}
	
	public copyNumber(value: number, existingBlock?: MemoryBlock, blockIndex?: number): MemoryBlock {
		const block = existingBlock || this.allocate(1, BYTES.PTR);
		const buffer = new DataView(this.memory.buffer, block.pointer, block.length);
		let index = blockIndex || 0;
		index = (index > 0 ? index * BYTES.PTR : 0);
		
		if (IsInt(value)) {
			buffer.setInt32(index, value, true);
		} else {
			buffer.setFloat32(index, value, true);
		}
		
		return block;
	}
	
	public resetByteOffset(): void {
		this.maximumByteOffset = RoundToMultiple(
			new Int32Array(this.memory.buffer).indexOf(0) * BYTES.PTR,
			BYTES.PTR * 2
		);
	}
	
	public setStaticBuffer(): void {
		MemoryManager.buffer = this.memory.buffer;
	}
	
	public unsetStaticBuffer(): void {
		delete MemoryManager.buffer;
	}
	
	public debug(): void {
		console.log(new Int32Array(this.memory.buffer, 0, 200));
		console.log(this.allocatedMemoryBlocks);
		console.log(`Memory Usage: ${this.getUsage()}KB`);
	}
}