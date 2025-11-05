import React from 'react';
import DocumentPicker from 'react-native-document-picker';
import { Button } from 'react-native-paper';

export default function FilePicker({ onPicked }: { onPicked: (uri:string)=>void }) {
  async function pick() {
    const res = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.plainText, DocumentPicker.types.json] });
    onPicked(res.uri);
  }
  return <Button onPress={pick}>Pick JSON File</Button>;
}
