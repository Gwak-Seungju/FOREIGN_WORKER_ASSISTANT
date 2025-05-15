import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Conversation = {
  id: number;
  title: string;
};

const CONVERSATIONS_KEY = 'chat_conversations';
const getMessagesKey = (id: number) => `chat_messages_${id}`;

export default function ChatbotLayout() {
  const router = useRouter();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<number | null>(null);
  const [conversationName, setConversationName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CONVERSATIONS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setConversations(Array.isArray(parsed) ? parsed : []);
        } catch {
          setConversations([]);
        }
      } else {
        setConversations([]);
      }
    })();
  }, []);

  const saveConversations = async (data: typeof conversations) => {
    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(data));
  };

  const openMenu = async () => {
    const stored = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(Array.isArray(parsed) ? parsed : []);
      } catch {
        setConversations([]);
      }
    } else {
      setConversations([]);
    }

    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setShowMenu(false));
  };

  return (
    <>
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <Text style={{ fontSize: 24 }}>≡</Text>
      </TouchableOpacity>

      <Stack screenOptions={{ headerShown: false }} />

      <Modal visible={showMenu} transparent>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View style={[styles.sidebarBase, { left: slideAnim }]}>
                <TouchableOpacity onPress={closeMenu} style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 24 }}>≡</Text>
                </TouchableOpacity>
                <TextInput
                  placeholder={t('chat.sidebar.input_placeholder')}
                  style={styles.input}
                  value={conversationName}
                  onChangeText={setConversationName}
                />
                <TouchableOpacity
                  onPress={async () => {
                    const newId = Date.now();
                    const newConv = {
                      id: newId,
                      title: conversationName.trim() || 'new chat',
                    };

                    const updated = [...conversations, newConv];
                    setConversations(updated);
                    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
                    await AsyncStorage.setItem(`chat_messages_${newId}`, JSON.stringify([]));

                    setCurrentConvId(newId);
                    setConversationName(''); // reset input
                    closeMenu();
                    router.push(`/chatbot/${newId}`);
                  }}
                  style={{
                    backgroundColor: '#000',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>{t('chat.sidebar.new_chat')}</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{t('chat.sidebar.conversation_list')}</Text>
                {conversations.length === 0 ? (
                  <Text style={{ color: '#aaa', fontStyle: 'italic', marginTop: 8 }}>
                     {t('chat.sidebar.empty_message')}
                  </Text>
                ) : (
                  conversations.map((conv) =>
                    !!conv?.title && (
                      <View key={conv.id} style={styles.conversationItem}>
                        <TouchableOpacity
                          onPress={() => {
                            router.push(`/chatbot/${conv.id}`);
                            setCurrentConvId(conv.id);
                            closeMenu();
                          }}
                          style={{ flex: 1 }}
                        >
                          <Text numberOfLines={1} ellipsizeMode="tail" style={{ flexShrink: 1 }}>
                            {conv.title}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={async () => {
                            const filtered = conversations.filter((c) => c.id !== conv.id);
                            setConversations(filtered);
                            await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
                            await AsyncStorage.removeItem(getMessagesKey(conv.id));
                          }}
                        >
                          <AntDesign name="delete" size={16} color="red" />
                        </TouchableOpacity>
                      </View>
                    )
                  )
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
    borderRadius: 6,
  },
  sidebarBase: {
    width: 280,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  newChatButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});