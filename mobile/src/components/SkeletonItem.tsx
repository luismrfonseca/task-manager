import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated';
import { GlassContainer } from './GlassContainer';

const { width } = Dimensions.get('window');

export const SkeletonItem = ({ index = 0 }: { index?: number }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        // Delay animation slightly for each item to create a nice wave effect
        const delay = index * 100;

        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <GlassContainer style={styles.glass}>
                <View style={styles.titlePlaceholder} />
                <View style={styles.textPlaceholder} />
            </GlassContainer>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    glass: {
        backgroundColor: 'rgba(255,255,255,0.05)', // Even more transparent for skeleton
    },
    titlePlaceholder: {
        height: 20,
        width: '60%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        marginBottom: 8,
    },
    textPlaceholder: {
        height: 14,
        width: '40%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
    },
});
