import { View, Text } from "react-native";
import { Button } from "heroui-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Alert02Icon, ReloadIcon } from "@hugeicons/core-free-icons";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useAppTheme } from "@/contexts/app-theme-context";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title,
  description,
  retry,
  retryLabel,
}: ErrorStateProps) {
  const { t } = useLocalization();
  const { isLight } = useAppTheme();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <View className="mb-6 bg-danger/10 p-6 rounded-full">
        <StyledHugeIcon icon={Alert02Icon} size={48} className="text-danger" />
      </View>
      <Text className="text-2xl font-heading-bold text-foreground mb-2 text-center">
        {title || t("common.error.generic.title")}
      </Text>
      <Text className="text-muted text-center mb-8 font-sans text-base px-8">
        {description || t("common.error.generic.description")}
      </Text>
      {retry && (
        <Button
          onPress={retry}
          size="lg"
          className="rounded-2xl"
          pressableFeedbackVariant="ripple"
          pressableFeedbackRippleProps={{
            animation: {
              backgroundColor: { value: isLight ? "white" : "black" },
              opacity: { value: [0, 0.3, 0] },
            },
          }}
        >
          <StyledHugeIcon
            icon={ReloadIcon}
            size={20}
            className="text-white mr-2"
          />
          <Button.Label>
            {retryLabel || t("common.error.generic.retry")}
          </Button.Label>
        </Button>
      )}
    </View>
  );
}
