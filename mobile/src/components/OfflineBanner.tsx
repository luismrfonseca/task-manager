import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { GlassContainer } from './GlassContainer';

export const OfflineBanner = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    if (isConnected !== false) return null;

    return (
        <View style={styles.wrapper}>
            <GlassContainer style={styles.container}>
                <Text style={styles.text}>You are offline. Showing cached data.</Text>
            </GlassContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    container: {
        backgroundColor: 'rgba(255, 59, 48, 0.2)', // Red-ish tint for warning
        borderColor: 'rgba(255, 59, 48, 0.3)',
        borderRadius: 12,
    },
    text: {
        color: '#ff6b6b',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
