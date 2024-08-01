import React, { useState, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { CabContext } from '../context/CabContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebaseConfig';

export default function CabDetailScreen({ route }) {
  const { cab } = route.params;
  const { bookedCabs, setBookedCabs } = useContext(CabContext);
  const [loading, setLoading] = useState(false);

  const bookCab = async () => {
    if (bookedCabs.length < 2) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'bookings'), {
          cabId: cab.id,
          userId: 'USER_ID',
          bookingDate: new Date(),
          status: 'confirmed',
          companyName: cab.companyName,
          carModel: cab.carModel,
          imageUrl: cab.imageUrl,
        });
              
        setBookedCabs([...bookedCabs, cab]);
        Alert.alert("Booking Confirmed", "Your cab has been booked successfully.");
      } catch (error) {
        console.error('Error booking cab:', error);
        Alert.alert("Booking Failed", "There was an error booking the cab. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Booking Limit", "You cannot book more than 2 cabs at a time.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailContainer}>
        {cab.imageUrl ? (
          <Image
            style={styles.image}
            source={{ uri: cab.imageUrl }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>No Image Available</Text>
          </View>
        )}
        <Text style={styles.title}>{cab.companyName}</Text>
        <Text style={styles.subtitle}>{cab.carModel}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Passengers: {cab.passengerCount}</Text>
          <Text style={styles.infoText}>Rating: {cab.rating}</Text>
          <Text style={styles.infoText}>Cost/hour: ${cab.costPerHour}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Booking..." : "Book Cab"}
            onPress={bookCab}
            disabled={loading}
          />
          {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  loadingIndicator: {
    marginTop: 8,
  },
});
