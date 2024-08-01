import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, SafeAreaView, Alert, ActivityIndicator, Image } from 'react-native';
import { CabContext } from '../context/CabContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebaseConfig';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date ? new Date(date).toLocaleDateString(undefined, options) : 'Date not available';
};

export default function MyCabScreen() {
  const { bookedCabs, setBookedCabs } = useContext(CabContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', 'USER_ID'));
        const querySnapshot = await getDocs(q);
        setBookedCabs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteDoc(doc(db, 'bookings', bookingId));
              setBookedCabs(bookedCabs.filter(booking => booking.id !== bookingId));
              Alert.alert("Booking Cancelled", "Your booking has been cancelled successfully.");
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert("Cancellation Failed", "There was an error cancelling the booking. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : bookedCabs.length === 0 ? (
        <View style={styles.noBookingsContainer}>
          <Text style={styles.noBookingsText}>No bookings made yet.</Text>
        </View>
      ) : (
        <FlatList
          data={bookedCabs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.imageUrl ? (
                <Image
                  style={styles.image}
                  source={{ uri: item.imageUrl }}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text>No Image Available</Text>
                </View>
              )}
              <Text style={styles.companyName}>{item.companyName}</Text>
              <Text style={styles.carModel}>{item.carModel}</Text>
              <Text style={styles.rentingDate}>Booking Date: {formatDate(item.bookingDate ? item.bookingDate.toDate() : undefined)}</Text>
              <Button
                title="Cancel Booking"
                onPress={() => cancelBooking(item.id)}
                color="#ff6347"
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
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
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carModel: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 12,
  },
  rentingDate: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 12,
  },
  noBookingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookingsText: {
    fontSize: 18,
    color: '#777777',
  },
});
