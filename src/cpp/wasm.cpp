
#include "wasm.hpp"

void wasmTest()	{
	const char* myString = " Test string";
	printString("WASM");
	printString("Second line");
	printString(myString);
}

void utf8Test() {
	const char* myUTF8String = "порядке";
	printString("Тестирование");
	printString("веб-сборки");
	printString(myUTF8String);
}

void printIntArray(const int* array, const int length) {
	for (int i = 0; i < length; i++) {
		printInt(array[i]);
	}
}

void printFloatArray(const float* array, const int length) {
	for (int i = 0; i < length; i++) {
		printFloat(array[i]);
	}
}

void printJSString(const char* str) {
	printString(str);
}

void printDataStruct(const DataStruct* data) {
	printString("DataStruct:");
	printInt(data->prop1);
	printInt(data->prop2);
	printFloat(data->prop3);
	printString("-> DS:");
	printInt(data->prop4->prop1);
	printInt(data->prop4->prop2);
	printJSString(data->prop4->prop3);
}

void memoryAddressTest() {
	int* ptr = (int*)244;
	ptr[0] = 1;
	ptr[1] = 2;
	ptr[2] = 3;
	
	printPtr(ptr);
}