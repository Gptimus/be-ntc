import { api } from "@be-ntc/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Card } from "heroui-native";
import { Text, View, TouchableOpacity } from "react-native";

import { Container } from "@/components/container";
import { authClient, useSession } from "@/lib/auth-client";

export default function Home() {
  const healthCheck = useQuery(api.healthCheck.get);
  const { data: session } = useSession();

  return (
    <Container className="p-6">
      <View className="py-4 mb-6">
        <Text className="text-4xl font-bold font-heading-bold text-foreground mb-2">
          BETTER T STACK
        </Text>
      </View>

      {session?.user ? (
        <Card variant="secondary" className="p-4 mb-4">
          <View className="mb-2">
            <Text className="text-foreground text-base">
              Welcome,{" "}
              <Text className="font-semibold">{session.user.name}</Text>
            </Text>
          </View>
          <Text className="text-muted text-sm mb-4">{session.user.email}</Text>
          <TouchableOpacity
            className="bg-danger px-4 py-2 rounded-md self-start"
            onPress={() => {
              authClient.signOut();
            }}
          >
            <Text className="text-danger-foreground font-medium">Sign Out</Text>
          </TouchableOpacity>
        </Card>
      ) : null}
    </Container>
  );
}
