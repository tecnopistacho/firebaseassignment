import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebaseconfiguration.ts';
import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function App() {
  console.log("DB value: ", db);

  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(list);
    });
    return unsubscribe;
  }, []);

  const addItem = async () => {
    if (text.trim().length == 0) return;

    await addDoc(collection(db, "items"), {
      name: text
    });
    setText('');
  };

  const deleteItem = (id: string) => {
    console.log("Deleting item with id: ", id);

    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { 
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "items", id))
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Add item"
          value={text}
          onChangeText={setText}
        />
        <Button title="Add" onPress={addItem} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => deleteItem(item.id)}>
            <Text style={styles.item}>{item.name} (tap to delete)</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  item: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 10,
  },
});


