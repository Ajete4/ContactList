import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import contactsData from './assets/conctact_smaple_data(1).json';


export default function App() {
  const [searchText, setSearchText] = useState('');

  // Filtrimi i kontakteve sipas emrit
  const filteredContacts = contactsData.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.phone, { color: '#34C759' }]}>{item.phone}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header me ikonë telefoni */}
      <View style={styles.headerContainer}>
        <Ionicons name="call-outline" size={32} color="#34C759" />
        <Text style={styles.header}>Lista e Kontakteve</Text>
      </View>

      {/* TextInput për filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          underlineColorAndroid="transparent"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Numri i kontakteve të filtruar */}
      <Text style={styles.countText}>{filteredContacts.length} kontakte</Text>

      {/* Lista e kontakteve */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: '#F0F1F5',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginLeft: 8,
  },

searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingHorizontal: 12,
  elevation: 2,          
  shadowColor: '#000',   
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderWidth: 0,        
},


  searchInput: {
  flex: 1,
  height: 40,
  fontSize: 16,
  borderWidth: 0,
  backgroundColor: 'transparent', 
  padding: 0,
},

  clearButton: {
    marginLeft: 8,
  },

  countText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    textAlign: 'right',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginRight: 16,
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  phone: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500',
  },

  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
  },
});
