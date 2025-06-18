import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BookOpen, Smartphone, Armchair, Shirt, Dumbbell, PenTool, Microwave, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { ProductCategory } from '../types';

interface CategoryButtonProps {
  category: ProductCategory;
  isSelected?: boolean;
  onPress: () => void;
}

const categoryIcons = {
  textbooks: BookOpen,
  electronics: Smartphone,
  furniture: Armchair,
  clothing: Shirt,
  sports: Dumbbell,
  stationery: PenTool,
  appliances: Microwave,
  other: MoreHorizontal,
};

const categoryLabels = {
  textbooks: 'Textbooks',
  electronics: 'Electronics',
  furniture: 'Furniture',
  clothing: 'Clothing',
  sports: 'Sports',
  stationery: 'Stationery',
  appliances: 'Appliances',
  other: 'Other',
};

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {
  const Icon = categoryIcons[category];
  
  return (
    <TouchableOpacity
      style={[styles.button, isSelected && styles.selectedButton]}
      onPress={onPress}
    >
      <Icon 
        size={24} 
        color={isSelected ? '#FFFFFF' : '#6B7280'} 
      />
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
        {categoryLabels[category]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    minWidth: 80,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});