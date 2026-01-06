import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { SignUp } from "@/components/sign-up";

export default function SignUpScreen() {
  return (
    <Container className="p-6 justify-center">
      <View className="mb-8">
        <Text className="text-4xl font-heading-bold text-foreground mb-2">
          Create Account
        </Text>
        <Text className="text-base text-muted">
          Sign up to get started with BE-NTC
        </Text>
      </View>

      <SignUp />

      <View className="mt-6 flex-row justify-center items-center gap-2">
        <Text className="text-muted">Already have an account?</Text>
        <Link href="/(guest)/sign-in" asChild>
          <Text className="text-primary font-medium">Sign In</Text>
        </Link>
      </View>
    </Container>
  );
}
