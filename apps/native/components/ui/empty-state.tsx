import { View, Text } from "react-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { InboxIcon } from "@hugeicons/core-free-icons";
import { useLocalization } from "@/localization/hooks/use-localization";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const { t } = useLocalization();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <View className="mb-6 bg-default-100 p-6 rounded-full">
        <StyledHugeIcon
          icon={InboxIcon}
          size={48}
          className="text-muted-foreground"
        />
      </View>
      <Text className="text-xl font-heading-medium text-foreground mb-2 text-center">
        {title || t("common.empty.generic.title")}
      </Text>
      <Text className="text-muted text-center font-sans text-base px-8">
        {description || t("common.empty.generic.description")}
      </Text>
    </View>
  );
}
