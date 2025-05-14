import { useConversationStore } from '@/stores/conversationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const exampleMessages = [
  '외국인 등록증을 잃어버렸을 때 어떻게 해야 하나요?',
  'H-2 비자로 직장 변경이 가능한가요?',
  '체류 기간 연장은 언제 신청하나요?',
];

const getMessagesKey = (id: number) => `chat_messages_${id}`;

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { conversations, setConversations } = useConversationStore();

  const conversationId = Number(id);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { id: number; role: 'user' | 'assistant'; content: string }[]
  >([]);

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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const isFirstMessage = messages.length === 0;

    const userMsg = { id: Date.now(), role: 'user' as const, content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');

    const reply = await sendMessageToOpenAI(updated);
    const assistantMsg = { id: Date.now() + 1, role: 'assistant' as const, content: reply };
    const finalMessages = [...updated, assistantMsg];
    setMessages(finalMessages);
    // Persist to AsyncStorage
    if (conversationId) {
      await AsyncStorage.setItem(getMessagesKey(conversationId), JSON.stringify(finalMessages));
    }

    if (isFirstMessage && conversationId) {
      const stored = await AsyncStorage.getItem('chat_conversations');
      const base = stored ? JSON.parse(stored) : conversations;

      const updatedConversations = base.map((c: { id: number }) =>
        c.id === conversationId ? { ...c, title: finalMessages[0].content } : c
      );
      setConversations(updatedConversations);
      await AsyncStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      const saved = await AsyncStorage.getItem(getMessagesKey(conversationId));
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
  
        // ✅ 조건: user 메시지만 있고 assistant 응답이 없을 경우
        if (parsed.length === 1 && parsed[0].role === 'user') {
          const reply = await sendMessageToOpenAI(parsed);
          const assistantMsg = { id: Date.now(), role: 'assistant', content: reply };
          const final = [...parsed, assistantMsg];
          setMessages(final);
          await AsyncStorage.setItem(getMessagesKey(conversationId), JSON.stringify(final));
        }
      }
    };
    loadMessages();
  }, [conversationId]);

  return (
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
      />

      {messages.length === 0 && (
        <View style={styles.examplesBelow}>
          <Text style={styles.examplesTitle}>무엇이 궁금하신가요?</Text>
          {exampleMessages.map((msg, idx) => (
            <TouchableOpacity key={idx} onPress={() => handleSend(msg)}>
              <Text style={styles.exampleText}>❝ {msg} ❞</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="질문을 입력하세요"
          style={styles.input}
        />
        <Button title="전송" onPress={() => handleSend(input)} disabled={!input.trim()} />
      </View>
    </View>
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
  examplesTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  exampleText: { marginBottom: 12, fontSize: 16, color: '#333' },
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
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
});