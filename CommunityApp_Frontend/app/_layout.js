import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

const AppLayout = () => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(authState);
    if (authState.authenticated === false) {
      router.replace('/login');
    }
  }, [authState, router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="userVerify" options={{ headerShown: false }} />
      <Stack.Screen name="organizationVerify" options={{ headerShown: false }} />
      <Stack.Screen name="user" options={{ headerShown: false }} />
      <Stack.Screen name="organization" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
};
