import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Product, SearchFilters } from '../types';

export const addProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  images: string[]
): Promise<Product> => {
  try {
    if (!images || images.length === 0) {
      throw new Error('At least one image is required');
    }

    // Validate product data
    if (!product.title || !product.description || !product.category) {
      throw new Error('Missing required product information');
    }

    if (product.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Upload images first
    const imageUrls = await Promise.all(
      images.map(async (imageUri, index) => {
        try {
          const response = await fetch(imageUri);
          if (!response.ok) {
            throw new Error(`Failed to fetch image ${index + 1}`);
          }
          const blob = await response.blob();
          const storageRef = ref(storage, `products/${Date.now()}_${index}`);
          await uploadBytes(storageRef, blob);
          return await getDownloadURL(storageRef);
        } catch (error) {
          console.error(`Error uploading image ${index + 1}:`, error);
          throw new Error(`Failed to upload image ${index + 1}`);
        }
      })
    );

    const newProduct: Omit<Product, 'id'> = {
      ...product,
      images: imageUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'products'), newProduct);
    
    return {
      ...newProduct,
      id: docRef.id,
    } as Product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProducts = async (
  filters?: SearchFilters,
  lastDoc?: QueryDocumentSnapshot,
  limitCount: number = 20
): Promise<{ products: Product[], lastDoc?: QueryDocumentSnapshot }> => {
  try {
    if (limitCount <= 0 || limitCount > 100) {
      throw new Error('Invalid limit count. Must be between 1 and 100.');
    }

    const constraints: QueryConstraint[] = [
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    ];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters?.minPrice !== undefined && filters.minPrice > 0) {
      constraints.push(where('price', '>=', filters.minPrice));
    }

    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }

    if (filters?.isRental !== undefined) {
      constraints.push(where('isRental', '==', filters.isRental));
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, 'products'), ...constraints);
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    let newLastDoc: QueryDocumentSnapshot | undefined;

    querySnapshot.forEach((doc) => {
      try {
        const productData = doc.data();
        const product: Product = {
          id: doc.id,
          sellerId: productData.sellerId,
          title: productData.title,
          description: productData.description,
          category: productData.category,
          tags: productData.tags || [],
          condition: productData.condition,
          price: productData.price,
          isRental: productData.isRental || false,
          rentalDuration: productData.rentalDuration,
          images: productData.images || [],
          status: productData.status,
          location: productData.location,
          courseTags: productData.courseTags || [],
          departmentTags: productData.departmentTags || [],
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date(),
        };
        products.push(product);
        newLastDoc = doc;
      } catch (error) {
        console.error('Error parsing product data:', error);
      }
    });

    return { products, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error getting products:', error);
    return { products: [] };
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const productData = docSnap.data();
      return {
        id: docSnap.id,
        sellerId: productData.sellerId,
        title: productData.title,
        description: productData.description,
        category: productData.category,
        tags: productData.tags || [],
        condition: productData.condition,
        price: productData.price,
        isRental: productData.isRental || false,
        rentalDuration: productData.rentalDuration,
        images: productData.images || [],
        status: productData.status,
        location: productData.location,
        courseTags: productData.courseTags || [],
        departmentTags: productData.departmentTags || [],
        createdAt: productData.createdAt?.toDate() || new Date(),
        updatedAt: productData.updatedAt?.toDate() || new Date(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

export const updateProductStatus = async (
  productId: string, 
  status: Product['status']
): Promise<void> => {
  try {
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    if (!['available', 'sold', 'rented', 'reserved'].includes(status)) {
      throw new Error('Invalid status value');
    }

    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, { 
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};

export const getUserProducts = async (userId: string): Promise<Product[]> => {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      try {
        const productData = doc.data();
        const product: Product = {
          id: doc.id,
          sellerId: productData.sellerId,
          title: productData.title,
          description: productData.description,
          category: productData.category,
          tags: productData.tags || [],
          condition: productData.condition,
          price: productData.price,
          isRental: productData.isRental || false,
          rentalDuration: productData.rentalDuration,
          images: productData.images || [],
          status: productData.status,
          location: productData.location,
          courseTags: productData.courseTags || [],
          departmentTags: productData.departmentTags || [],
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date(),
        };
        products.push(product);
      } catch (error) {
        console.error('Error parsing user product data:', error);
      }
    });

    return products;
  } catch (error) {
    console.error('Error getting user products:', error);
    return [];
  }
};