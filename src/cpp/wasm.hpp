#include <cstdint>

struct DS2 {
	int prop1;
	int prop2;
	char* prop3;
};

struct DataStruct {
	int prop1;
	int prop2;
	float prop3;
	DS2* prop4;
};

extern "C" {
// Imports
extern void printString(const char* text);
extern void printInt(const int number);
extern void printFloat(const float number);
extern void printPtr(const void* ptr);

// Exports
void wasmTest();
void utf8Test();
void printIntArray(const int* array, const int length);
void printFloatArray(const float* array, const int length);
void printJSString(const char* str);
void printDataStruct(const DataStruct* data);
void memoryAddressTest();
}