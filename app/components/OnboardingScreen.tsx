import React, { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Theme } from '../types';

interface OnboardingScreenProps {
  onComplete: () => void;
  theme: Theme;
}

const TypingText = ({ text, style, onComplete }: { text: string; style: any; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const typingSpeed = 50;

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <Text style={style}>
      {displayText}
      <Text style={[style, { opacity: 0.5 }]}>_</Text>
    </Text>
  );
};

const OnboardingScreen = ({ onComplete, theme }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const messages = [
    "👋 Welcome to T-Check",
    "A terminal-inspired task manager",
    "Use tabs to organize your tasks",
    "Set priorities with P0-P3",
    "All set. Let's get things done ⚡",
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleMessageComplete = () => {
    if (currentStep < messages.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 500);
    }
  };

  const handleStart = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.background,
          opacity: fadeAnim 
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.accent }]}>
            T✓ task manager
          </Text>
        </View>

        <View style={styles.messages}>
          {messages.map((message, index) => (
            <View key={index} style={styles.messageContainer}>
              <Text style={[styles.prompt, { color: theme.accent }]}>
                {index === currentStep ? '>' : ' '}
              </Text>
              {index === currentStep ? (
                <TypingText
                  text={message}
                  style={[styles.message, { color: theme.foreground }]}
                  onComplete={handleMessageComplete}
                />
              ) : index < currentStep ? (
                <Text style={[styles.message, { color: theme.foreground }]}>
                  {message}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        {currentStep === messages.length - 1 && (
          <TouchableOpacity
            style={[styles.startButton, { borderColor: theme.accent }]}
            onPress={handleStart}
          >
            <Text style={[styles.startButtonText, { color: theme.accent }]}>
              $ start
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 600,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },
  messages: {
    marginBottom: 40,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 24,
  },
  prompt: {
    fontFamily: 'monospace',
    fontSize: 16,
    marginRight: 8,
  },
  message: {
    fontFamily: 'monospace',
    fontSize: 16,
    flex: 1,
  },
  startButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
  },
  startButtonText: {
    fontFamily: 'monospace',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default OnboardingScreen; 