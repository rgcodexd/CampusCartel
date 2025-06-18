import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { CategoryButton } from '../../components/CategoryButton';
import { ProductCategory } from '../../types';
import { validatePrice, validateRequired } from '../../utils/validation';

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

const conditions = [
  { value: 'new', label: 'New', description: 'Brand new, never used' },
  { value: 'like-new', label: 'Like New', description: 'Barely used, excellent condition' },
  { value: 'good', label: 'Good', description: 'Used with minor signs of wear' },
  { value: 'fair', label: 'Fair', description: 'Used with noticeable wear' },
  { value: 'poor', label: 'Poor', description: 'Heavy wear, but functional' },
];

const rentalDurations = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'semester', label: 'Semester' },
];

export default function AddItemScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [isRental, setIsRental] = useState(false);
  const [rentalDuration, setRentalDuration] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [courseTags, setCourseTags] = useState('');
  const [departmentTags, setDepartmentTags] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(title)) {
      newErrors.title = 'Title is required';
    }

    if (!validateRequired(description)) {
      newErrors.description = 'Description is required';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!condition) {
      newErrors.condition = 'Please select item condition';
    }

    if (!validatePrice(price)) {
      newErrors.price = 'Please enter a valid price (1-10000)';
    }

    if (isRental && !rentalDuration) {
      newErrors.rentalDuration = 'Please select rental duration';
    }

    if (images.length === 0) {
      newErrors.images = 'Please add at least one image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Here you would call your addProduct service
      const productData = {
        title,
        description,
        category: category!,
        condition: condition as any,
        price: parseFloat(price),
        isRental,
        rentalDuration: isRental ? rentalDuration as any : undefined,
        tags: [
          ...courseTags.split(',').map(tag => tag.trim()).filter(Boolean),
          ...departmentTags.split(',').map(tag => tag.trim()).filter(Boolean),
        ],
        courseTags: courseTags.split(',').map(tag => tag.trim()).filter(Boolean),
        departmentTags: departmentTags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      console.log('Product data:', productData);
      console.log('Images:', images);

      Alert.alert('Success', 'Your item has been listed successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setTitle('');
            setDescription('');
            setCategory(null);
            setCondition('');
            setPrice('');
            setIsRental(false);
            setRentalDuration('');
            setImages([]);
            setCourseTags('');
            setDepartmentTags('');
            setErrors({});
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to list your item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>List New Item</Text>
          <Text style={styles.subtitle}>Share what you want to sell or rent</Text>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.sectionSubtitle}>Add up to 5 photos of your item</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 5 && (
              <View style={styles.addImageButtons}>
                <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                  <ImageIcon size={24} color="#6B7280" />
                  <Text style={styles.addImageText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.addImageButton} onPress={takePhoto}>
                  <Camera size={24} color="#6B7280" />
                  <Text style={styles.addImageText}>Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
          
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={[styles.textInput, errors.title && styles.inputError]}
              placeholder="What are you selling?"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              placeholder="Describe your item, its condition, and any important details..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryButtons}>
              {categories.map((cat) => (
                <CategoryButton
                  key={cat}
                  category={cat}
                  isSelected={category === cat}
                  onPress={() => setCategory(cat)}
                />
              ))}
            </View>
          </ScrollView>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition *</Text>
          {conditions.map((cond) => (
            <TouchableOpacity
              key={cond.value}
              style={[
                styles.conditionOption,
                condition === cond.value && styles.conditionOptionSelected
              ]}
              onPress={() => setCondition(cond.value)}
            >
              <View style={styles.conditionOptionContent}>
                <Text style={[
                  styles.conditionLabel,
                  condition === cond.value && styles.conditionLabelSelected
                ]}>
                  {cond.label}
                </Text>
                <Text style={[
                  styles.conditionDescription,
                  condition === cond.value && styles.conditionDescriptionSelected
                ]}>
                  {cond.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                condition === cond.value && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
          {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          
          <View style={styles.rentalToggle}>
            <Text style={styles.inputLabel}>Is this a rental?</Text>
            <Switch
              value={isRental}
              onValueChange={setIsRental}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={isRental ? '#2563EB' : '#FFFFFF'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Price * {isRental && rentalDuration && `(per ${rentalDuration.replace('ly', '')})`}
            </Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.priceInput, errors.price && styles.inputError]}
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          {isRental && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rental Duration *</Text>
              <View style={styles.durationButtons}>
                {rentalDurations.map((duration) => (
                  <TouchableOpacity
                    key={duration.value}
                    style={[
                      styles.durationButton,
                      rentalDuration === duration.value && styles.durationButtonSelected
                    ]}
                    onPress={() => setRentalDuration(duration.value)}
                  >
                    <Text style={[
                      styles.durationButtonText,
                      rentalDuration === duration.value && styles.durationButtonTextSelected
                    ]}>
                      {duration.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.rentalDuration && <Text style={styles.errorText}>{errors.rentalDuration}</Text>}
            </View>
          )}
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags (Optional)</Text>
          <Text style={styles.sectionSubtitle}>Help others find your item</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Course Tags</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., CS101, MATH201, BIO301"
              value={courseTags}
              onChangeText={setCourseTags}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Department Tags</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Computer Science, Engineering, Biology"
              value={departmentTags}
              onChangeText={setDepartmentTags}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Listing Item...' : 'List Item'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  imagesContainer: {
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addImageText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
    fontFamily: 'Inter-Regular',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  conditionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conditionOptionSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#2563EB',
  },
  conditionOptionContent: {
    flex: 1,
  },
  conditionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter-Medium',
  },
  conditionLabelSelected: {
    color: '#2563EB',
  },
  conditionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  conditionDescriptionSelected: {
    color: '#2563EB',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  radioButtonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  rentalToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  durationButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  durationButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  durationButtonTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
});