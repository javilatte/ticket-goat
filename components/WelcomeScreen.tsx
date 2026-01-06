import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeScreenProps {
  onClose: () => void;
}

export default function WelcomeScreen({ onClose }: WelcomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    console.log('WelcomeScreen: Close button pressed');
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('WelcomeScreen: Animation completed, calling onClose');
      onClose();
    });
    
    // Timeout de seguridad por si la animación falla
    setTimeout(() => {
      console.log('WelcomeScreen: Safety timeout triggered');
      onClose();
    }, 800);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={[styles.gradient, styles.fullScreen]}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.glowContainer}>
            <View style={[styles.glow, styles.glow1]} />
            <View style={[styles.glow, styles.glow2]} />
            <View style={[styles.glow, styles.glow3]} />
          </View>

          <Text style={styles.mainText}>Bienvenido al futuro</Text>
          <Text style={styles.mainText}>del seguimiento del patrimonio</Text>

          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>Rastrea • Analiza • Crece</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Comenzar</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    zIndex: 9999,
  },
  fullScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    opacity: 0.3,
  },
  glow1: {
    backgroundColor: '#3B82F6',
    transform: [{ scale: 1 }],
  },
  glow2: {
    backgroundColor: '#10B981',
    transform: [{ scale: 1.5 }],
    opacity: 0.25,
  },
  glow3: {
    backgroundColor: '#8B5CF6',
    transform: [{ scale: 2 }],
    opacity: 0.15,
  },
  mainText: {
    fontSize: 38,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 2,
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    zIndex: 1,
    fontFamily: 'StackSansNotch-SemiBold',
    letterSpacing: 0.5,
  },
  taglineContainer: {
    marginTop: 40,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  tagline: {
    fontSize: 17,
    color: '#60A5FA',
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  closeButton: {
    marginTop: 60,
    paddingHorizontal: 50,
    paddingVertical: 18,
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});
