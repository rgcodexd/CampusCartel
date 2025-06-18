export interface User {
  id: string;
  email: string;
  name: string;
  collegeName: string;
  studentId: string;
  profilePicture?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalRatings: number;
  createdAt: Date;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: ProductCategory;
  tags: string[];
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  price: number;
  isRental: boolean;
  rentalDuration?: 'daily' | 'weekly' | 'monthly' | 'semester';
  images: string[];
  status: 'available' | 'sold' | 'rented' | 'reserved';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  courseTags?: string[];
  departmentTags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 
  | 'textbooks'
  | 'electronics'
  | 'furniture'
  | 'clothing'
  | 'sports'
  | 'stationery'
  | 'appliances'
  | 'other';

export interface Chat {
  id: string;
  participants: string[];
  productId?: string;
  lastMessage: Message;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  type: 'text' | 'image' | 'offer' | 'location';
  offerAmount?: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  type: 'purchase' | 'rental';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Rating {
  id: string;
  raterId: string;
  ratedUserId: string;
  transactionId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SearchFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  maxDistance?: number;
  condition?: string[];
  collegeName?: string;
  department?: string;
  isRental?: boolean;
  tags?: string[];
}