// Simple streaming approach: read file in chunks and extract top-level array items.
// This is a pragmatic parser for large files formatted as [obj1,obj2,...]
// Not a full JSON parser — works for well-formed arrays of objects without nested top-level arrays.
import RNFS from 'react-native-fs';
import { Filter, match } from './filterEngine';

export async function streamFilterApply(uri: string, filters: Filter[], onMatch: (obj:any)=>Promise<void>, bufferSize = 1024*1024) {
  const stat = await RNFS.stat(uri);
  const size = Number(stat.size);
  let position = 0;
  let remainder = '';
  while (position < size) {
    const len = Math.min(bufferSize, size - position);
    const chunk = await RNFS.read(uri, len, position, 'utf8');
    position += len;
    let s = remainder + chunk;
    // remove starting '[' or trailing ',' characters as we parse objects
    let i = 0;
    let depth = 0;
    let inString = false;
    let escape = false;
    let startIdx = -1;
    for (i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '"' && !escape) inString = !inString;
      if (ch === '\\' && inString) escape = !escape; else escape = false;
      if (inString) continue;
      if (ch === '{') {
        if (depth === 0) startIdx = i;
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0 && startIdx >= 0) {
          const objText = s.substring(startIdx, i+1);
          try {
            const obj = JSON.parse(objText);
            if (!filters || filters.length === 0 || filters.some(()=>true)) {
              // apply filters via match()
              const passed = filters.length ? filters.every(f => match(obj, f)) : true;
              if (passed) await onMatch(obj);
            }
          } catch (e) {
            // ignore parse errors for partial chunks
          }
          // mark region consumed
          s = s.slice(i+1);
          i = -1; startIdx = -1;
        }
      }
    }
    remainder = s; // keep leftover for next chunk
  }
  // handle final remainder (if any)
}
