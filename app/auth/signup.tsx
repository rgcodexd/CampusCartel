import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Hash, Phone } from 'lucide-react-native';
import { signUp } from '../../services/auth';
import { getErrorMessage } from '../../utils/errorHandling';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    studentId: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    } else if (!formData.email.toLowerCase().includes('.edu')) {
      newErrors.email = 'Please use your college email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (formData.studentId.trim().length < 6) {
      newErrors.studentId = 'Student ID must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        collegeName: formData.collegeName.trim(),
        studentId: formData.studentId.trim(),
        phone: formData.phone.trim(),
      });
      
      Alert.alert(
        'Account Created',
        'Your account has been created successfully! Please check your email for verification.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the campus community</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Full name"
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  autoCapitalize="words"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="College email address"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* College Name Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <GraduationCap size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.collegeName && styles.inputError]}
                  placeholder="College/University name"
                  value={formData.collegeName}
                  onChangeText={(text) => updateFormData('collegeName', text)}
                  autoCapitalize="words"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.collegeName && <Text style={styles.errorText}>{errors.collegeName}</Text>}
            </View>

            {/* Student ID Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Hash size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.studentId && styles.inputError]}
                  placeholder="Student ID"
                  value={formData.studentId}
                  onChangeText={(text) => updateFormData('studentId', text)}
                  autoCapitalize="characters"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.studentId && <Text style={styles.errorText}>{errors.studentId}</Text>}
            </View>

            {/* Phone Input (Optional) */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Phone size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number (optional)"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData('phone', text)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  signUpButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#6B7280',
    fontSize: 14,
    marginHorizontal: 16,
    fontFamily: 'Inter-Regular',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  loginLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
}); 