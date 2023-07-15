import { MemoryManager } from "../memory";
import { Module } from "../module";

class DS2 {	
	constructor(
		public prop1: number,
		public prop2: number,
		public prop3: string
	) {}
}

class DataStruct {	
	public prop4: DS2;
	
	constructor(
		public prop1: number,
		public prop2: number,
		public prop3: number,
		ds2Prop1: number,
		ds2Prop2: number,
		ds2Prop3: string
	) {
		this.prop4 = new DS2(ds2Prop1, ds2Prop2, ds2Prop3);
	}
}

export class MemTest extends Module {
	constructor() {
		const imports = {
			printString(pointer: number): void {
				const text = MemoryManager.pointerToString(pointer);
				console.log(`PrintString: ${text}`);
			},
			
			printInt(int: number): void {
				console.log(`PrintInt: ${int}`);
			},
			
			printFloat(float: number): void {
				console.log(`PrintFloat: ${float}`);
			},
			
			printPtr(ptr: number): void {
				console.log(`PrintPtr: ${ptr}`);
			}
		};
		
		super("memtest5", 256, imports);
	}
	
	public run(): Promise<boolean> {
		return super
			.run()
			.then((success: boolean) => {
				const str = "test string";
				const strMem = this.memoryManager.copyString(str);
				this.callExport("printJSString", strMem.pointer);
				this.memoryManager.deallocate(strMem);
				
				const str2 = "string test 2";
				const str2Mem = this.memoryManager.copyString(str2);
				this.callExport("printJSString", str2Mem.pointer);
				this.memoryManager.deallocate(str2Mem);
				
				const array = [123, -1337, 808, 987654321];
				const arrayMem = this.memoryManager.copyObject(array);
				this.callExport("printIntArray", ...arrayMem.getMetadata());
				this.memoryManager.deallocate(arrayMem);
				
				const floatArray = [34.67, 9.1];
				const floatArrayMem = this.memoryManager.copyObject(floatArray);
				this.callExport("printFloatArray", ...floatArrayMem.getMetadata());
				this.memoryManager.deallocate(floatArrayMem);
				
				const str3 = "3 testin str";
				const str3Mem = this.memoryManager.copyString(str3);
				this.callExport("printJSString", str3Mem.pointer);
				this.memoryManager.deallocate(str3Mem);
				
				const array2 = [420, 666];
				const array2Mem = this.memoryManager.copyObject(array2);
				this.callExport("printIntArray", ...array2Mem.getMetadata());
				this.memoryManager.deallocate(array2Mem);
				
				const data = new DataStruct(1, 2, 3.4, 9, 8, "ds2 is mah class");
				const dataMem = this.memoryManager.copyObject(data);
				this.callExport("printDataStruct", dataMem.pointer);
				this.memoryManager.deallocate(dataMem);
				
				const str4 = "four is da word";
				const str4Mem = this.memoryManager.copyString(str4);
				this.callExport("printJSString", str4Mem.pointer);
				this.memoryManager.deallocate(str4Mem);
				
				this.callExport("memoryAddressTest");
				
				this.memoryManager.debug();
				return success;
		});
	}
}