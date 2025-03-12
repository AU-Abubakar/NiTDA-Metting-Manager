import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import Voice from '@react-native-voice/voice';
// import Voice from '@react-native-voice/voice/dist/voice';
import summarizeText from './Summarizer';
import * as Permissions from 'expo-permissions';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (Voice) {
      Voice.onSpeechResults = onSpeechResults;
    }
    return () => {
      if (Voice) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, []);

  const onSpeechResults = (e) => {
    setTranscription(e.value[0]);
  };

  const startRecording = async () => {
    try {
      if (Voice) {
        await Voice.start('en-US');
        setIsRecording(true);
        console.log('Recording started');
      } else {
        console.error('Voice module is not initialized');
      }
    } catch (e) {
      console.error('Error starting recording:', e);
    }
  };

  const stopRecording = async () => {
    try {
      if (Voice) {
        await Voice.stop();
        setIsRecording(false);
        generateSummary(transcription);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateSummary = async (text) => {
    const summarizedText = await summarizeText(text);
    setSummary(summarizedText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NITDA MEETING MANAGER</Text>
      <Button title={isRecording ? 'Stop Recording' : 'Start Recording'} onPress={isRecording ? stopRecording : startRecording} />
      <ScrollView style={styles.transcriptionContainer}>
      <Text>TEST WORD</Text>
        <Text style={styles.transcriptionText}>Transcription: {transcription}</Text>
      </ScrollView>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Key Points:</Text>
        <Text style={styles.summaryText}>
          {summary.split('. ').map((point, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {point.trim()}
            </Text>
          ))}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transcriptionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 20,
    height: 200,
  },
  transcriptionText: {
    fontSize: 16,
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
  },
  bulletPoint: {
    marginTop: 5,
  },
});