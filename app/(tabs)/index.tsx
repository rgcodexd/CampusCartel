import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Filter, MapPin } from 'lucide-react-native';
import { ProductCard } from '../../components/ProductCard';
import { CategoryButton } from '../../components/CategoryButton';
import { Product, ProductCategory } from '../../types';
import { getProducts } from '../../services/products';

const categories: ProductCategory[] = [
  'textbooks',
  'electronics',
  'furniture',
  'clothing',
  'sports',
  'stationery',
  'appliances',
  'other',
];

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { products: fetchedProducts } = await getProducts({
        category: selectedCategory || undefined,
      });
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: ProductCategory) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleProductPress = (product: Product) => {
    // Navigate to product detail screen
    console.log('Product pressed:', product.id);
  };

  const handleFavorite = (productId: string) => {
    // Toggle favorite functionality
    console.log('Toggle favorite:', productId);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.locationText}>Campus Area</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Find amazing deals</Text>
        <Text style={styles.welcomeSubtitle}>
          Buy, sell, and rent items from fellow students
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onPress={() => handleCategoryPress(category)}
          />
        ))}
      </ScrollView>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
            onFavorite={() => handleFavorite(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or browse different categories
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  notificationButton: {
    padding: 8,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 12,
  },
  productsList: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
});