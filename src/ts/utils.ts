
export function RoundToMultiple(num: number, multiple: number): number {
	const int = Math.floor(num);
	return int % multiple === 0 ? int : int + multiple - ( ( int + multiple ) % multiple );
}

export function IsInt(value: number): boolean {
	return value % 1 === 0;
}

export function IsFloat(value: number): boolean {
	return value % 1 !== 0;
}