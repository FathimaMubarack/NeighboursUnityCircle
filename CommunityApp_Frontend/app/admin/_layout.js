import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="NewArea" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="OrganizationApproval" options={{ title: 'Admin Dashboard' }} />
    </Stack>
  );
}
