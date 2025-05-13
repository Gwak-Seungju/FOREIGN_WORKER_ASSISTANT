import { useConversationStore } from '@/stores/conversationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const CONVERSATIONS_KEY = 'chat_conversations';
const getMessagesKey = (id: number) => `chat_messages_${id}`;

const exampleQuestions = [
  '외국인 등록증을 잃어버렸을 때 어떻게 해야 하나요?',
  'H-2 비자로 직장 변경이 가능한가요?',
  '체류 기간 연장은 언제 신청하나요?',
];

export default function ChatbotIndex() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const { setConversations } = useConversationStore();

  const handleSubmit = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const newId = Date.now();
    const newConv = { id: newId, title: text };

    const stored = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    const conversations = stored ? JSON.parse(stored) : [];
    const updatedConvs = [...conversations, newConv];

    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConvs));
    await AsyncStorage.setItem(getMessagesKey(newId), JSON.stringify([
      { id: Date.now(), role: 'user', content: text }
    ]));

    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'user', content: text }],
    //   }),
    // });
    // const data = await response.json();
    // const assistantReply = data.choices?.[0]?.message?.content ?? '죄송합니다. 응답을 생성하지 못했습니다.';
// 
    // await AsyncStorage.setItem(getMessagesKey(newId), JSON.stringify([
    //   { id: Date.now(), role: 'user', content: text },
    //   { id: Date.now() + 1, role: 'assistant', content: assistantReply }
    // ]));

    setConversations(updatedConvs);
    setInput('');
    router.push(`/chatbot/${newId}`);
  };

  const handleExamplePress = async (question: string) => {
    await handleSubmit(question);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>무엇이 궁금하신가요?</Text>

      <View style={{ justifyContent: 'flex-end' }}>
        <FlatList
          data={exampleQuestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleExamplePress(item)} style={styles.question}>
              <Text style={styles.questionText}>❝ {item} ❞</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 12, marginBottom: 60 }}
        />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="질문을 입력하세요"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => handleSubmit(input)}>
            <Text style={{ color: '#fff' }}>전송</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  questionText: {
    fontSize: 16,
    color: '#333',
  },
  inputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});