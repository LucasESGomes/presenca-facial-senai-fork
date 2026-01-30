// utils/normalizeClasses.js
export function normalizeClasses(classes) {
    if (!Array.isArray(classes)) return [];
    return classes
        .filter(Boolean)
        .map((c) => c.trim().toUpperCase());
}
