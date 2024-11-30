import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'User Dashboard' }} />
      <Stack.Screen name="newComplaint" options={{ title: 'User Dashboard' }} />
      <Stack.Screen name="Report" options={{ title: 'User Dashboard' }} />
      <Stack.Screen name="donations" options={{ title: 'User Dashboard' }} />
    </Stack>
  );
}
