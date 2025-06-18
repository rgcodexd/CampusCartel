import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Star,
  Share2,
  Flag
} from 'lucide-react-native';
import { getProductById } from '../../services/products';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistance } from '../../utils/location';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      setProduct(productData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to contact the seller');
      router.push('/auth/login');
      return;
    }
    
    if (product?.sellerId === user.id) {
      Alert.alert('Cannot Contact', 'You cannot contact yourself');
      return;
    }

    // Navigate to chat or show contact options
    Alert.alert(
      'Contact Seller',
      'Choose how you would like to contact the seller',
      [
        { text: 'Message', onPress: () => handleMessage() },
        { text: 'Call', onPress: () => handleCall() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleMessage = () => {
    // Navigate to chat screen
    router.push(`/chat/${product?.sellerId}`);
  };

  const handleCall = () => {
    // Handle phone call
    Alert.alert('Call', 'Phone call functionality would be implemented here');
  };

  const handleFavorite = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save favorites');
      router.push('/auth/login');
      return;
    }
    setIsFavorited(!isFavorited);
    // TODO: Implement favorite functionality
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert('Share', 'Share functionality would be implemented here');
  };

  const handleReport = () => {
    Alert.alert(
      'Report Item',
      'Are you sure you want to report this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', style: 'destructive', onPress: () => {
          Alert.alert('Reported', 'Thank you for your report. We will review it shortly.');
        }},
      ]
    );
  };

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleReport}>
            <Flag size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.productImage} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          
          {/* Image Indicators */}
          {product.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          {/* Price and Favorite */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ${product.price}
              {product.isRental && product.rentalDuration && ` / ${product.rentalDuration}`}
            </Text>
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
              <Heart 
                size={24} 
                color={isFavorited ? '#EF4444' : '#6B7280'} 
                fill={isFavorited ? '#EF4444' : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Condition and Category */}
          <View style={styles.metaRow}>
            <View style={styles.conditionContainer}>
              <View style={[styles.conditionDot, { backgroundColor: getConditionColor(product.condition) }]} />
              <Text style={styles.condition}>{product.condition}</Text>
            </View>
            <Text style={styles.category}>{product.category}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Tags */}
          {product.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.locationText}>{product.location.address}</Text>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerInfo}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400' }}
                style={styles.sellerAvatar}
              />
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>John Doe</Text>
                <View style={styles.sellerRating}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>4.8 (24 reviews)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Contact Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <MessageCircle size={20} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  productImage: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563EB',
    fontFamily: 'Inter-Bold',
  },
  favoriteButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  condition: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
    fontFamily: 'Inter-Regular',
  },
  category: {
    fontSize: 14,
    color: '#9CA3AF',
    textTransform: 'capitalize',
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Inter-Regular',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contactButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
}); 