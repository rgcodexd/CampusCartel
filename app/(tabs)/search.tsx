import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Filter, X, MapPin, DollarSign } from 'lucide-react-native';
import { ProductCard } from '../../components/ProductCard';
import { CategoryButton } from '../../components/CategoryButton';
import { Product, ProductCategory, SearchFilters } from '../../types';
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

const conditions = ['new', 'like-new', 'good', 'fair', 'poor'];
const distances = [5, 10, 25, 50];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    if (searchQuery.length > 2 || Object.keys(filters).length > 0) {
      searchProducts();
    }
  }, [searchQuery, filters]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      const { products: searchResults } = await getProducts(filters);
      
      // Filter by search query
      const filteredResults = searchResults.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setProducts(filteredResults);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setShowFilters(false);
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.id);
  };

  const handleFavorite = (productId: string) => {
    console.log('Toggle favorite:', productId);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => filters[key as keyof SearchFilters] !== undefined).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search & Discover</Text>
        <TouchableOpacity
          style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={getActiveFiltersCount() > 0 ? '#FFFFFF' : '#6B7280'} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for books, electronics, furniture..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activeFilters}>
              {filters.category && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>{filters.category}</Text>
                  <TouchableOpacity onPress={() => handleFilterChange('category', undefined)}>
                    <X size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.maxDistance && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>Within {filters.maxDistance}km</Text>
                  <TouchableOpacity onPress={() => handleFilterChange('maxDistance', undefined)}>
                    <X size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    handleFilterChange('minPrice', undefined);
                    handleFilterChange('maxPrice', undefined);
                  }}>
                    <X size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Results */}
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
            onFavorite={() => handleFavorite(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {searchQuery.length === 0 && Object.keys(filters).length === 0 ? (
              <>
                <SearchIcon size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Start your search</Text>
                <Text style={styles.emptySubtitle}>
                  Search for items or use filters to find what you need
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your search terms or filters
                </Text>
              </>
            )}
          </View>
        }
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.filtersModal}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersContent}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryButtons}>
                  {categories.map((category) => (
                    <CategoryButton
                      key={category}
                      category={category}
                      isSelected={filters.category === category}
                      onPress={() => handleFilterChange('category', 
                        filters.category === category ? undefined : category
                      )}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Distance Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Distance</Text>
              <View style={styles.distanceButtons}>
                {distances.map((distance) => (
                  <TouchableOpacity
                    key={distance}
                    style={[
                      styles.distanceButton,
                      filters.maxDistance === distance && styles.distanceButtonActive
                    ]}
                    onPress={() => handleFilterChange('maxDistance',
                      filters.maxDistance === distance ? undefined : distance
                    )}
                  >
                    <MapPin size={16} color={filters.maxDistance === distance ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.distanceButtonText,
                      filters.maxDistance === distance && styles.distanceButtonTextActive
                    ]}>
                      {distance}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceInputs}>
                <View style={styles.priceInputContainer}>
                  <DollarSign size={16} color="#9CA3AF" />
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Min"
                    value={filters.minPrice?.toString() || ''}
                    onChangeText={(text) => {
                      const price = parseFloat(text) || undefined;
                      handleFilterChange('minPrice', price);
                    }}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <Text style={styles.priceRangeSeparator}>to</Text>
                <View style={styles.priceInputContainer}>
                  <DollarSign size={16} color="#9CA3AF" />
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Max"
                    value={filters.maxPrice?.toString() || ''}
                    onChangeText={(text) => {
                      const price = parseFloat(text) || undefined;
                      handleFilterChange('maxPrice', price);
                    }}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Condition Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Condition</Text>
              <View style={styles.conditionButtons}>
                {conditions.map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionButton,
                      filters.condition?.includes(condition) && styles.conditionButtonActive
                    ]}
                    onPress={() => {
                      const currentConditions = filters.condition || [];
                      const updatedConditions = currentConditions.includes(condition)
                        ? currentConditions.filter(c => c !== condition)
                        : [...currentConditions, condition];
                      handleFilterChange('condition', updatedConditions.length > 0 ? updatedConditions : undefined);
                    }}
                  >
                    <Text style={[
                      styles.conditionButtonText,
                      filters.condition?.includes(condition) && styles.conditionButtonTextActive
                    ]}>
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.filtersFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  filterButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
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
    marginTop: 16,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  filtersModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  filtersContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    marginVertical: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  distanceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  distanceButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  distanceButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  distanceButtonTextActive: {
    color: '#FFFFFF',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  priceRangeSeparator: {
    fontSize: 14,
    color: '#6B7280',
  },
  conditionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conditionButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  conditionButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  conditionButtonTextActive: {
    color: '#FFFFFF',
  },
  filtersFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});