import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<number | null>(null);
  const [conversationName, setConversationName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CONVERSATIONS_KEY);
      if (stored) setConversations(JSON.parse(stored));
    })();
  }, []);

  const saveConversations = async (data: typeof conversations) => {
    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(data));
  };

  const openMenu = async () => {
    const stored = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    if (stored) setConversations(JSON.parse(stored));

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
                  placeholder="대화 이름 입력"
                  style={styles.input}
                  value={conversationName}
                  onChangeText={setConversationName}
                />
                <TouchableOpacity
                  onPress={async () => {
                    const newId = Date.now();
                    const newConv = {
                      id: newId,
                      title: conversationName.trim() || '새 대화',
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
                  <Text style={{ color: '#fff', textAlign: 'center' }}>+ 새 대화 시작</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>대화 목록</Text>
                {conversations.filter((c) => c.title).map((conv) => (
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
                      <Text style={{ color: 'red', marginLeft: 10 }}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                ))}
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
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 3,
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