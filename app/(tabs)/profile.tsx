import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Star, Package, Heart, CreditCard, Shield, Bell, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, MapPin, Mail, Phone, GraduationCap } from 'lucide-react-native';

const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  phone: '+1 (555) 123-4567',
  collegeName: 'Stanford University',
  studentId: 'STU123456',
  profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400',
  location: {
    address: 'Stanford, CA',
  },
  verificationStatus: 'verified' as const,
  rating: 4.8,
  totalRatings: 24,
  totalListings: 12,
  totalSales: 8,
  memberSince: 'September 2023',
};

interface ProfileStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

const stats: ProfileStat[] = [
  { label: 'Total Listings', value: '12', icon: Package },
  { label: 'Successful Sales', value: '8', icon: Star },
  { label: 'Saved Items', value: '5', icon: Heart },
];

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  hasToggle?: boolean;
  toggleValue?: boolean;
  hasChevron?: boolean;
  isDangerous?: boolean;
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleMyListings = () => {
    console.log('View my listings');
  };

  const handleSavedItems = () => {
    console.log('View saved items');
  };

  const handlePaymentMethods = () => {
    console.log('Manage payment methods');
  };

  const handleVerification = () => {
    console.log('Manage verification');
  };

  const handleSupport = () => {
    console.log('Contact support');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { label: 'My Listings', icon: Package, action: handleMyListings, hasChevron: true },
        { label: 'Saved Items', icon: Heart, action: handleSavedItems, hasChevron: true },
        { label: 'Payment Methods', icon: CreditCard, action: handlePaymentMethods, hasChevron: true },
        { label: 'Verification', icon: Shield, action: handleVerification, hasChevron: true },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { 
          label: 'Push Notifications', 
          icon: Bell, 
          action: () => setNotificationsEnabled(!notificationsEnabled),
          hasToggle: true,
          toggleValue: notificationsEnabled,
        },
        { 
          label: 'Location Services', 
          icon: MapPin, 
          action: () => setLocationEnabled(!locationEnabled),
          hasToggle: true,
          toggleValue: locationEnabled,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', icon: HelpCircle, action: handleSupport, hasChevron: true },
        { label: 'Contact Support', icon: Mail, action: handleSupport, hasChevron: true },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        { label: 'Logout', icon: LogOut, action: handleLogout, isDangerous: true },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.label}
      style={styles.menuItem}
      onPress={item.action}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, item.isDangerous && styles.dangerousIcon]}>
          <item.icon size={20} color={item.isDangerous ? '#EF4444' : '#6B7280'} />
        </View>
        <Text style={[styles.menuLabel, item.isDangerous && styles.dangerousLabel]}>
          {item.label}
        </Text>
      </View>
      
      <View style={styles.menuItemRight}>
        {item.hasToggle && (
          <Switch
            value={item.toggleValue}
            onValueChange={item.action}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor={item.toggleValue ? '#2563EB' : '#FFFFFF'}
          />
        )}
        {item.hasChevron && (
          <Settings size={16} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit3 size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: mockUser.profilePicture }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit3 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{mockUser.name}</Text>
              {mockUser.verificationStatus === 'verified' && (
                <View style={styles.verifiedBadge}>
                  <Shield size={16} color="#10B981" />
                </View>
              )}
            </View>

            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{mockUser.rating}</Text>
              <Text style={styles.ratingCount}>({mockUser.totalRatings} reviews)</Text>
            </View>

            <View style={styles.infoRows}>
              <View style={styles.infoRow}>
                <GraduationCap size={16} color="#6B7280" />
                <Text style={styles.infoText}>{mockUser.collegeName}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Mail size={16} color="#6B7280" />
                <Text style={styles.infoText}>{mockUser.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.infoText}>{mockUser.location.address}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.memberSince}>Member since {mockUser.memberSince}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <View style={styles.statIcon}>
                <stat.icon size={20} color="#2563EB" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuItems}>
              {section.items.map(renderMenuItem)}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.appVersion}>
          <Text style={styles.versionText}>CampusExchange v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  verifiedBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  ratingCount: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  infoRows: {
    width: '100%',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  memberSince: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  menuSection: {
    marginTop: 24,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  menuItems: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  dangerousIcon: {
    backgroundColor: '#FEF2F2',
  },
  menuLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  dangerousLabel: {
    color: '#EF4444',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appVersion: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
});