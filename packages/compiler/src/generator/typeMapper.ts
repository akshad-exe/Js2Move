/**
 * Type Mapper - Maps MoveJS types to Move types
 */

export interface TypeMapping {
  moveJsType: string;
  moveType: string;
}

const TYPE_MAPPINGS: TypeMapping[] = [
  // Basic types
  { moveJsType: 'u8', moveType: 'u8' },
  { moveJsType: 'u64', moveType: 'u64' },
  { moveJsType: 'u128', moveType: 'u128' },
  { moveJsType: 'bool', moveType: 'bool' },
  { moveJsType: 'address', moveType: 'address' },
  { moveJsType: 'signer', moveType: 'signer' },
  // String in MoveJS typically maps to u64 in Move for simplicity
  { moveJsType: 'string', moveType: 'u64' },
  { moveJsType: 'vector', moveType: 'vector' },
];

/**
 * Maps a MoveJS type to a Move type
 * @param moveJsType The type from MoveJS source
 * @returns The corresponding Move type
 */
export function mapType(moveJsType: string): string {
  const mapping = TYPE_MAPPINGS.find(m => m.moveJsType === moveJsType);
  if (mapping) {
    return mapping.moveType;
  }
  // If no mapping found, return as-is (could be custom struct name)
  return moveJsType;
}

/**
 * Determines if a parameter should be a signer reference
 * @param paramName The parameter name
 * @param paramType The parameter type
 * @param isInitFunction Whether this is an init function
 * @param isGetterFunction Whether this is a getter function
 * @returns true if parameter should be &signer, false otherwise
 */
export function shouldBeSigner(paramName: string, paramType: string, isInitFunction: boolean, isGetterFunction: boolean = false): boolean {
  // Only convert address type to &signer
  if (paramType !== 'address') {
    return paramType === 'signer';
  }

  // In init functions, first address parameter becomes &signer
  // (typically named owner, creator, account, etc.)
  if (isInitFunction) {
    return true;
  }

  // In getter functions, parameters stay as address (used for reading)
  if (isGetterFunction) {
    return false;
  }

  // For setter/entry functions, specific patterns become &signer
  if (paramName === 'addr') {
    return true;
  }

  // Explicit signer name
  if (paramName.toLowerCase() === 'signer' || paramName.toLowerCase() === 'account') {
    return true;
  }

  return false;
}

/**
 * Analyzes a struct field type
 * @param fieldName The field name
 * @param fieldType The field type from MoveJS
 * @returns The Move type to use
 */
export function mapStructFieldType(fieldName: string, fieldType: string): string {
  return mapType(fieldType);
}
