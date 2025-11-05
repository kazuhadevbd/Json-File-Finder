
export type Filter = { key: string; op: string; value: any };

export function getValue(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function match(record: any, f: Filter): boolean {
  const v = getValue(record, f.key);
  if (v == null) return false;
  const val = f.value;
  switch (f.op) {
    case '==': return v === val;
    case '!=': return v !== val;
    case '>': return Number(v) > Number(val);
    case '<': return Number(v) < Number(val);
    case '>=': return Number(v) >= Number(val);
    case '<=': return Number(v) <= Number(val);
    case 'range': return Number(v) >= Number(val[0]) && Number(v) <= Number(val[1]);
    case 'contains': return String(v).toLowerCase().includes(String(val).toLowerCase());
    default: return false;
  }
}

export function applyFilters(records: any[], filters: Filter[], combineWith: 'AND'|'OR' = 'AND') {
  if (!filters || !filters.length) return records;
  return records.filter(rec => {
    const rs = filters.map(f => match(rec, f));
    return combineWith === 'AND' ? rs.every(Boolean) : rs.some(Boolean);
  });
}
