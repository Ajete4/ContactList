import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, SectionList, Image, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, Platform, LayoutAnimation, UIManager, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import contactsData from './assets/conctact_smaple_data(1).json'; // Sigurohu që JSON ka id unik dhe emër të thjeshtë

// Aktivizo LayoutAnimation për Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  background: '#F0F3F8',
  card: '#FFFFFF',
  primary: '#007AFF',
  secondary: '#3C3C43',
  textLight: '#8A8A8E',
  sectionHeader: '#E8E9ED',
};

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [expandedContactId, setExpandedContactId] = useState(null);
  const sectionListRef = useRef(null);

  // Grupimi dhe renditja e kontakteve alfabetikisht sipas emrit të plotë
  const groupedContacts = useMemo(() => {
    const filtered = contactsData.filter(contact =>
      contact.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const groups = filtered.reduce((acc, contact) => {
      const sortKey = contact.name.trim().charAt(0).toUpperCase();
      if (!acc[sortKey]) acc[sortKey] = [];
      acc[sortKey].push(contact);
      return acc;
    }, {});

    return Object.keys(groups)
      .sort()
      .map(key => ({
        title: key,
        data: groups[key].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [searchText]);

  // Scroll në seksionin e zgjedhur
  const scrollToSection = (sectionTitle) => {
    const index = groupedContacts.findIndex(section => section.title === sectionTitle);
    if (index !== -1 && sectionListRef.current && groupedContacts[index].data.length > 0) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        viewPosition: 0,
        animated: true,
      });
    }
  };

  // Toggle zgjerimi i kontaktit
  const toggleExpand = (contactId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedContactId(contactId === expandedContactId ? null : contactId);
  };

  // Funksione për thirrje dhe mesazh
  const handleCall = (phoneNumber) => Linking.openURL(`tel:${phoneNumber}`);
  const handleMessage = (phoneNumber) => Linking.openURL(`sms:${phoneNumber}`);

  // Render i një kontakti
  const renderItem = ({ item }) => {
    const nameParts = item.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    const isExpanded = item.id === expandedContactId;

    return (
      <View>
        <TouchableOpacity
          style={styles.contactCard}
          activeOpacity={0.8}
          onPress={() => toggleExpand(item.id)}
        >
          <Image
            source={{ uri: item.avatar || 'https://via.placeholder.com/60' }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.firstName} numberOfLines={1}>{firstName}</Text>
            {lastName ? (
              <Text style={styles.lastName} numberOfLines={1}>{lastName}</Text>
            ) : <View style={{ height: 20 }} />}
            <Text style={styles.phone}>{item.phone}</Text>
            <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedOptions}>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleCall(item.phone)}>
              <Ionicons name="call" size={24} color={COLORS.card} />
              <Text style={styles.optionText}>Telefono</Text>
            </TouchableOpacity>
            <View style={styles.optionSeparator} />
            <TouchableOpacity style={styles.optionButton} onPress={() => handleMessage(item.phone)}>
              <Ionicons name="chatbubbles" size={24} color={COLORS.card} />
              <Text style={styles.optionText}>Mesazh</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render titullit të seksionit
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Kontaktet</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="person-add-outline" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kërko emrin..."
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.listContainer}>
          <SectionList
            ref={sectionListRef}
            sections={groupedContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            stickySectionHeadersEnabled={true}
          />

          <View style={styles.indexBar}>
            {ALPHABET.map(letter => (
              <TouchableOpacity
                key={letter}
                onPress={() => scrollToSection(letter)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Text style={[
                  styles.indexLetter,
                  groupedContacts.find(s => s.title === letter) && styles.indexLetterActive
                ]}>
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Stilet
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 18, paddingTop: Platform.OS === 'android' ? 10 : 0 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 10,
    marginTop: Platform.OS === 'ios' ? 0 : 10,
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: COLORS.secondary },
  headerIcon: { padding: 5 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: 14, paddingHorizontal: 12, marginBottom: 15, height: 50,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 17, color: COLORS.secondary, padding: 0 },
  clearButton: { marginLeft: 8, padding: 5 },
  listContainer: { flex: 1, flexDirection: 'row' },
  sectionHeaderContainer: {
    backgroundColor: COLORS.sectionHeader, paddingVertical: 6, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#E0E0E0', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1,
  },
  sectionHeaderText: { fontSize: 16, fontWeight: '700', color: COLORS.secondary },
  indexBar: {
    position: 'absolute', right: 0, top: 10, bottom: 10, width: 25,
    justifyContent: 'center', alignItems: 'center', paddingVertical: 5, marginRight: 2,
    backgroundColor: 'transparent',
  },
  indexLetter: { fontSize: 10, fontWeight: '500', color: COLORS.textLight, paddingVertical: Platform.OS === 'ios' ? 2 : 1 },
  indexLetterActive: { color: COLORS.primary, fontWeight: 'bold', fontSize: 11 },

  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: 20, padding: 16, marginVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 5,
    elevation: 3, borderWidth: 1, borderColor: '#F5F5F7', marginRight: 25,
    justifyContent: 'space-between',
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15, borderWidth: 3, borderColor: COLORS.primary },
  info: { flex: 1, justifyContent: 'center', paddingVertical: 4 },
  firstName: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, lineHeight: 22 },
  lastName: { fontSize: 16, fontWeight: '500', color: COLORS.textLight, marginBottom: 6, lineHeight: 20 },
  phone: { fontSize: 14, color: COLORS.primary, fontWeight: '600', marginTop: 0 },
  email: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },

  expandedOptions: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: COLORS.primary, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    marginTop: -4, marginBottom: 8, paddingVertical: 15,
    marginHorizontal: 18, marginRight: 25,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  optionButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  optionText: { color: COLORS.card, fontSize: 14, fontWeight: '600', marginTop: 5 },
  optionSeparator: { width: 1, height: '80%', backgroundColor: 'rgba(255, 255, 255, 0.3)' },
});
