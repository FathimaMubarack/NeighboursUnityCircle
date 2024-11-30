// app/organization/_layout.js
import { Stack } from 'expo-router';

export default function OrganizationLayout() {
  return (
    <Stack>
    <Stack.Screen name="index" options={{ title: 'Organization Dashboard' }} />
    <Stack.Screen name="organizationHome" options={{ title: 'Organization Dashboard' }} />
    <Stack.Screen name="newComplaint" options={{ title: 'Organization Dashboard' }} />
    <Stack.Screen name="Report" options={{ title: 'Organization Dashboard' }} />
    <Stack.Screen name="donations" options={{ title: 'Organization Dashboard' }} />
    <Stack.Screen name="createCampaign" options={{ title: 'Organization Dashboard' }} />
    <Stack.Screen name="EditCampaignGoods" options={{ title: 'Organization Dashboard' }} />
  </Stack>
  );
}
