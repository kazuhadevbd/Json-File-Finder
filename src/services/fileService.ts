
import RNFS from 'react-native-fs';

export async function readSmallFile(uri: string): Promise<any[]> {
  const text = await RNFS.readFile(uri, 'utf8');
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
    // if object with top-level key that is array, try to find first array
    for (const k of Object.keys(parsed)) if (Array.isArray(parsed[k])) return parsed[k];
  }
  throw new Error('Expected JSON array at top level');
}

export async function writeTempJson(data: any[], filename = 'filtered.json') {
  const path = `${RNFS.TemporaryDirectoryPath || RNFS.DocumentDirectoryPath}/${filename}`;
  await RNFS.writeFile(path, JSON.stringify(data), 'utf8');
  return path;
}
