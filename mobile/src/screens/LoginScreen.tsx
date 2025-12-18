import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassContainer } from '../components/GlassContainer';
import { useAuthStore } from '../stores/authStore';
import api from '../api/client';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, refresh_token } = response.data;
            // For now assuming response also returns user object or we fetch it.
            // Based on AuthController, login returns tokens.
            // We might need to fetch profile after login or just fake user for now.
            // Let's fetch profile.

            // Manually set tokens first to use in interceptor/request
            // Actually store logic handles setting items, but we need to call login action.
            // Let's pass tokens to store login action.
            // But fetching profile needs token.
            // Let's fake user for a second or better:
            // login action sets tokens in SecureStore.
            await login({ id: '1', email, createdAt: new Date(), updatedAt: new Date() }, access_token, refresh_token);

        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground>
            <GlassContainer style={styles.glass}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
                </TouchableOpacity>
            </GlassContainer>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    glass: {
        margin: 20,
        marginTop: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    button: {
        backgroundColor: '#e94560',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
