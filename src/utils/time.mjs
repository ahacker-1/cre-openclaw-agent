export function nowIso() { return new Date().toISOString(); }
export function stamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }
