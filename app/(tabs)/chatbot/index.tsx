import { useConversationStore } from '@/stores/conversationStore';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const getMessagesKey = (id: number) => `chat_messages_${id}`;

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { conversations, setConversations } = useConversationStore();

  const conversationId = Number(id);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { id: number; role: 'user' | 'assistant'; content: string }[]
  >([]);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);

  const sendMessageToOpenAI = async (context: typeof messages) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: context.map(({ role, content }) => ({ role, content })),
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch {
      return '⚠️ 오류가 발생했습니다. 나중에 다시 시도해주세요.';
    }
  };

  const startNewConversation = async (text: string) => {
    const idToUse = Date.now();
    const newConversation = { id: idToUse, title: text };
    const stored = await AsyncStorage.getItem('chat_conversations');
    const existing = stored ? JSON.parse(stored) : [];
    const updatedConversations = [...existing, newConversation];
    await AsyncStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));
    setConversations(updatedConversations);
    setInput(''); // clear input immediately
    await AsyncStorage.setItem(getMessagesKey(idToUse), JSON.stringify([
      { id: Date.now(), role: 'user', content: text }
    ]));
    router.replace(`/(tabs)/chatbot/${idToUse}`);
  };

  const sendMessage = async (text: string) => {
    const isFirstMessage = messages.length === 0;
    const userMsg = { id: Date.now(), role: 'user' as const, content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');

    const reply = await sendMessageToOpenAI(updated);
    const assistantMsg = { id: Date.now() + 1, role: 'assistant' as const, content: reply };
    const finalMessages = [...updated, assistantMsg];
    setMessages(finalMessages);

    await AsyncStorage.setItem(getMessagesKey(conversationId), JSON.stringify(finalMessages));

    if (isFirstMessage) {
      const stored = await AsyncStorage.getItem('chat_conversations');
      const base = stored ? JSON.parse(stored) : conversations;
      const updatedConversations = base.map((c: { id: number }) =>
        c.id === conversationId ? { ...c, title: finalMessages[0].content } : c
      );
      setConversations(updatedConversations);
      await AsyncStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    if (!conversationId || isNaN(conversationId)) {
      startNewConversation(text);
    } else {
      sendMessage(text);
    }
  };
  const exampleMessages = [
    t('chat.examples.lost_registration_card'),
    t('chat.examples.h2_job_change'),
    t('chat.examples.stay_extension'),
  ];

  useEffect(() => {
    if (!conversationId || isNaN(conversationId)) return;

    const loadMessages = async () => {
      const saved = await AsyncStorage.getItem(getMessagesKey(conversationId));
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed);

        if (parsed.length === 1 && parsed[0].role === 'user') {
          const reply = await sendMessageToOpenAI(parsed);
          const assistantMsg = { id: Date.now(), role: 'assistant', content: reply };
          const final = [...parsed, assistantMsg];
          setMessages(final);
          await AsyncStorage.setItem(getMessagesKey(conversationId), JSON.stringify(final));
        }
      }
      setHasLoadedInitially(true);
    };

    loadMessages();
  }, [conversationId]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={60}
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={item.role === 'user' ? styles.user : styles.assistant}>
              {item.content}
            </Text>
          )}
          contentContainerStyle={{
            paddingBottom: messages.length === 0 ? 0 : 160,
            paddingTop: 60,
            paddingRight: 12,
          }}
          keyboardShouldPersistTaps="handled"
        />

        {messages.length === 0 && (
          <View style={styles.examplesBelow}>
            <Text style={styles.examplesTitle}>{t('chat.prompt.title')}</Text>
            {exampleMessages.map((msg, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleSend(msg)}>
                <Text style={styles.exampleText}>❝ {msg} ❞</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputWrapper}>
          <View style={styles.inputBox}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={messages.length === 0 ? t('chat.input.placeholder_first') : t('chat.input.placeholder')}
              style={styles.input}
              placeholderTextColor={'#999'}
              underlineColorAndroid="transparent"
              selectionColor="#007AFF"
            />
            <TouchableOpacity
              onPress={() => handleSend(input)}
              disabled={!input.trim()}
              style={styles.sendButtonInside}
            >
              <Feather name="send" size={20} color={input.trim() ? '#007AFF' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: '#fff' },
  examplesBelow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 60,
    backgroundColor: '#fff',
  },
  examplesTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12},
  exampleText: { marginBottom: 12, fontSize: 14, color: '#333' },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '80%',
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6E6E6',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '80%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  inputBoxFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  sendButtonInside: {
    paddingLeft: 8,
  },
});