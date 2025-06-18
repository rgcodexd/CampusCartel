import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';
import { validateEmail, validateCollegeEmail, validateStudentId } from '../utils/validation';
import { ValidationError } from '../utils/errorHandling';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  collegeName: string;
  studentId: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData): Promise<User> => {
  try {
    // Validate input data
    if (!validateEmail(data.email)) {
      throw new ValidationError('Please enter a valid email address');
    }

    if (!validateCollegeEmail(data.email)) {
      throw new ValidationError('Please use your college email address');
    }

    if (!validateStudentId(data.studentId)) {
      throw new ValidationError('Please enter a valid student ID (at least 6 characters)');
    }

    if (data.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    if (data.name.trim().length < 2) {
      throw new ValidationError('Please enter your full name');
    }

    if (data.collegeName.trim().length < 2) {
      throw new ValidationError('Please enter your college name');
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const firebaseUser = userCredential.user;

    // Create user profile
    const userData: Omit<User, 'id'> = {
      email: data.email,
      name: data.name,
      collegeName: data.collegeName,
      studentId: data.studentId,
      phone: data.phone || '',
      profilePicture: '',
      location: {
        latitude: 0,
        longitude: 0,
        address: '',
      },
      verificationStatus: 'pending',
      rating: 0,
      totalRatings: 0,
      createdAt: new Date(),
    };

    // Save user data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    // Update Firebase Auth profile
    await updateProfile(firebaseUser, {
      displayName: data.name,
    });

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new ValidationError('An account with this email already exists');
    }
    if (error.code === 'auth/weak-password') {
      throw new ValidationError('Password is too weak. Please choose a stronger password');
    }
    throw error;
  }
};

export const login = async (data: LoginData): Promise<User> => {
  try {
    if (!validateEmail(data.email)) {
      throw new ValidationError('Please enter a valid email address');
    }

    if (data.password.length < 1) {
      throw new ValidationError('Please enter your password');
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const firebaseUser = userCredential.user;
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new ValidationError('User profile not found');
    }

    return {
      id: firebaseUser.uid,
      ...userDoc.data(),
    } as User;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new ValidationError('No account found with this email address');
    }
    if (error.code === 'auth/wrong-password') {
      throw new ValidationError('Incorrect password');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new ValidationError('Too many failed attempts. Please try again later');
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!validateEmail(email)) {
      throw new ValidationError('Please enter a valid email address');
    }

    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new ValidationError('No account found with this email address');
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      return null;
    }

    return {
      id: firebaseUser.uid,
      ...userDoc.data(),
    } as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new ValidationError('User not authenticated');
    }

    const userRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedDoc = await getDoc(userRef);
    return {
      id: firebaseUser.uid,
      ...updatedDoc.data(),
    } as User;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          callback({
            id: firebaseUser.uid,
            ...userDoc.data(),
          } as User);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};