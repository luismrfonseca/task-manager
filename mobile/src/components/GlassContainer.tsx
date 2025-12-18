import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
    children,
    style,
    intensity = 50
}) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    content: {
        padding: 20,
        // Ensure content sits above the blur
        zIndex: 1,
    },
});
