import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={StyleSheet.absoluteFillObject}
            />
            {/* Decorative Blobs */}
            <LinearGradient
                colors={['#e94560', '#ff007f']}
                style={[styles.blob, styles.blob1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <LinearGradient
                colors={['#4ecca3', '#0f3460']}
                style={[styles.blob, styles.blob2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    blob: {
        position: 'absolute',
        borderRadius: 100,
        opacity: 0.7,
    },
    blob1: {
        width: 200,
        height: 200,
        top: -50,
        left: -50,
    },
    blob2: {
        width: 250,
        height: 250,
        bottom: -50,
        right: -50,
        opacity: 0.5,
    },
});
