import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';


export default function AdminDashboard() {
  return (
    <View>
      <View>
      <TouchableOpacity>
         <Link href={"NewArea"}> Add new Area </Link>
      </TouchableOpacity>
      </View>
      <View>
      <TouchableOpacity>
         <Link href={"OrganizationApproval"}> Approve Organization </Link>
      </TouchableOpacity>
      </View>
    </View>
  );
}
