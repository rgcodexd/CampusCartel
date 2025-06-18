import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MessageCircle, Clock, MoveVertical as MoreVertical } from 'lucide-react-native';

interface ChatPreview {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  productTitle?: string;
  productImage?: string;
}

const mockChats: ChatPreview[] = [
  {
    id: '1',
    participantName: 'Sarah Johnson',
    participantAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=400',
    lastMessage: 'Is the MacBook still available?',
    timestamp: '2 min ago',
    unreadCount: 2,
    productTitle: 'MacBook Pro 13"',
    productImage: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?w=400',
  },
  {
    id: '2',
    participantName: 'Mike Chen',
    participantAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=400',
    lastMessage: 'Thanks for the quick response!',
    timestamp: '1 hour ago',
    unreadCount: 0,
    productTitle: 'Calculus Textbook',
    productImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=400',
  },
  {
    id: '3',
    participantName: 'Emma Davis',
    participantAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=400',
    lastMessage: 'Can we meet tomorrow at 3 PM?',
    timestamp: '3 hours ago',
    unreadCount: 1,
    productTitle: 'Study Desk',
    productImage: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?w=400',
  },
  {
    id: '4',
    participantName: 'Alex Rodriguez',
    participantAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400',
    lastMessage: 'Would you consider $80?',
    timestamp: '1 day ago',
    unreadCount: 0,
    productTitle: 'Gaming Headset',
    productImage: 'https://images.pexels.com/photos/3394656/pexels-photo-3394656.jpeg?w=400',
  },
  {
    id: '5',
    participantName: 'Lisa Park',
    participantAvatar: 'https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?w=400',
    lastMessage: 'Perfect! See you then.',
    timestamp: '2 days ago',
    unreadCount: 0,
    productTitle: 'Winter Jacket',
    productImage: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?w=400',
  },
];

export default function ChatScreen() {
  const [chats, setChats] = useState<ChatPreview[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.productTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: ChatPreview) => {
    // Navigate to chat detail screen
    console.log('Open chat:', chat.id);
    
    // Mark as read
    setChats(prev =>
      prev.map(c =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const formatTimestamp = (timestamp: string): string => {
    return timestamp;
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.chatLeft}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.participantAvatar }}
            style={styles.avatar}
          />
          {item.unreadCount > 0 && (
            <View style={styles.onlineIndicator} />
          )}
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.participantName}>{item.participantName}</Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          
          {item.productTitle && (
            <Text style={styles.productTitle}>
              About: {item.productTitle}
            </Text>
          )}
          
          <Text style={[
            styles.lastMessage,
            item.unreadCount > 0 && styles.unreadMessage
          ]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>

      <View style={styles.chatRight}>
        {item.productImage && (
          <Image
            source={{ uri: item.productImage }}
            style={styles.productImage}
          />
        )}
        
        <View style={styles.chatMeta}>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MessageCircle size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Start buying or selling to begin conversations
            </Text>
          </View>
        }
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Clock size={20} color="#6B7280" />
          <Text style={styles.quickActionText}>Recent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <MessageCircle size={20} color="#6B7280" />
          <Text style={styles.quickActionText}>Unread</Text>
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
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
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
  chatList: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    backgroundColor: '#10B981',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  productTitle: {
    fontSize: 12,
    color: '#2563EB',
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  unreadMessage: {
    color: '#1F2937',
    fontWeight: '500',
  },
  chatRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  chatMeta: {
    alignItems: 'center',
    gap: 4,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
    gap: 24,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
});