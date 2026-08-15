/**
 * TimetableTypeResolver
 * Resolves the class type (LECTURE, LAB, TUTORIAL) based on subject short name
 * according to section 22 of SPECIFIATION.md.
 */
export function resolveClassType(subject) {
  if (!subject) return 'LECTURE';
  const upper = String(subject).trim().toUpperCase();
  
  if (upper.includes('-LAB') || upper.endsWith('LAB') || upper.includes(' LAB')) {
    return 'LAB';
  }
  if (upper.includes('-TUT') || upper.endsWith('TUT') || upper.includes(' TUTORIAL')) {
    return 'TUTORIAL';
  }
  return 'LECTURE';
}
