import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";

export default function SignInScreen() {
  return (
    <Container className="p-6 justify-center">
      <View className="mb-8">
        <Text className="text-4xl font-heading-bold text-foreground mb-2">
          Welcome Back
        </Text>
        <Text className="text-base text-muted">
          Sign in to your account to continue
        </Text>
      </View>

      <SignIn />

      <View className="mt-6 flex-row justify-center items-center gap-2">
        <Text className="text-muted">Don't have an account?</Text>
        <Link href="/(guest)/sign-up" asChild>
          <Text className="text-primary font-medium">Sign Up</Text>
        </Link>
      </View>
    </Container>
  );
}
