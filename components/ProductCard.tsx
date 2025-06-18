import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MapPin, Clock, Heart } from 'lucide-react-native';
import { Product } from '../types';
import { formatDistance } from '../utils/location';

interface ProductCardProps {
  product: Product;
  userLocation?: { latitude: number; longitude: number };
  onPress: () => void;
  onFavorite: () => void;
  isFavorited?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userLocation,
  onPress,
  onFavorite,
  isFavorited = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const distance = userLocation
    ? formatDistance(
        Math.sqrt(
          Math.pow(product.location.latitude - userLocation.latitude, 2) +
          Math.pow(product.location.longitude - userLocation.longitude, 2)
        ) * 111 // Rough conversion to km
      )
    : null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return '#10B981';
      case 'like-new': return '#059669';
      case 'good': return '#F59E0B';
      case 'fair': return '#F97316';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const imageSource = imageError || !product.images[0] 
    ? { uri: 'https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg' }
    : { uri: product.images[0] };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={onFavorite}
          activeOpacity={0.7}
        >
          <Heart 
            size={20} 
            color={isFavorited ? '#EF4444' : '#FFFFFF'} 
            fill={isFavorited ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
        {product.isRental && (
          <View style={styles.rentalBadge}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={styles.rentalText}>Rental</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.price}>
          ${product.price}
          {product.isRental && product.rentalDuration && ` / ${product.rentalDuration}`}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.conditionContainer}>
            <View style={[styles.conditionDot, { backgroundColor: getConditionColor(product.condition) }]} />
            <Text style={styles.condition}>{product.condition}</Text>
          </View>
          
          {distance && (
            <View style={styles.locationContainer}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.distance}>{distance}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.category}>{product.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  rentalBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rentalText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  condition: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: '#6B7280',
  },
  category: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
});