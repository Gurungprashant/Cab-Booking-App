import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { CabContext } from '../context/CabContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebaseConfig';

const CabsListScreen = ({ navigation }) => {
  const { availableCabs, setAvailableCabs } = useContext(CabContext);

  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cabs'));
        const cabs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableCabs(cabs);
      } catch (error) {
        console.error('Error fetching cabs:', error);
      }
    };

    fetchCabs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={availableCabs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CabDetail', { cab: item })}
          >
            {item.imageUrl ? (
              <Image
                style={styles.image}
                source={{ uri: item.imageUrl }}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image</Text>
              </View>
            )}
            <Text style={styles.companyName}>{item.companyName}</Text>
            <Text style={styles.carModel}>{item.carModel}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carModel: {
    fontSize: 16,
    color: '#555555',
  },
});

export default CabsListScreen;
