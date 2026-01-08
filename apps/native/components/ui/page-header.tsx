import React from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  description,
  showBackButton = true,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.duration(400)} className="mb-8">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full p-0 mb-4 items-center justify-center"
        >
          <StyledHugeIcon
            icon={ArrowLeft02Icon}
            size={24}
            className="text-foreground"
          />
        </Button>
      )}
      <Text className="text-3xl font-heading-bold text-foreground mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-muted font-sans text-base leading-relaxed">
          {description}
        </Text>
      )}
    </Animated.View>
  );
}
