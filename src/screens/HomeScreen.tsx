import React, { useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import FilePicker from '../components/FilePicker';
import { readSmallFile, writeTempJson } from '../services/fileService';
import { applyFilters } from '../services/filterEngine';
import { streamFilterApply } from '../services/streamParser';

export default function HomeScreen() {
  const [uri, setUri] = useState<string|null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [filters, setFilters] = useState([]);
  const [status, setStatus] = useState('');

  async function handlePicked(u: string) {
    setUri(u); setStatus('Reading file...');
    try {
      // naive size check: stat may fail on some URIs; catch and assume small
      const small = true;
      if (small) {
        const arr = await readSmallFile(u);
        setRecords(arr);
        setStatus(`Loaded ${arr.length} records`);
      } else {
        // streaming example
        const matches: any[] = [];
        await streamFilterApply(u, [], async (obj)=> { matches.push(obj); });
        setRecords(matches);
        setStatus(`Streamed ${matches.length} matches`);
      }
    } catch (e:any) {
      setStatus('Error: ' + e.message);
    }
  }

  function apply() {
    const out = applyFilters(records, filters);
    setRecords(out);
    setStatus(`Filtered: ${out.length}`);
  }

  async function exportFiltered() {
    const path = await writeTempJson(records, 'filtered.json');
    setStatus('Exported to ' + path);
  }

  return (
    <View style={{flex:1, padding:16}}>
      <FilePicker onPicked={handlePicked} />
      <Text>{status}</Text>
      <Button title="Apply filters" onPress={apply} />
      <Button title="Export filtered" onPress={exportFiltered} />
      <FlatList data={records} keyExtractor={(_,i)=>String(i)} renderItem={({item})=> <Text>{JSON.stringify(item)}</Text>} />
    </View>
  );
}
