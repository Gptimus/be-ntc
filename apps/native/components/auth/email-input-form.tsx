import { Button, TextField, Spinner } from "heroui-native";
import { View } from "react-native";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { useLocalization } from "@/localization/hooks/use-localization";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import Animated, {
  FadeInRight,
  FadeOutRight,
  LinearTransition,
  FadeIn,
} from "react-native-reanimated";
import type { EmailInputFormData } from "@/schemas/email-input.schema";

interface EmailInputFormProps {
  control: Control<EmailInputFormData>;
  errors: FieldErrors<EmailInputFormData>;
  isValid: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}

export function EmailInputForm({
  control,
  isValid,
  isLoading,
  onSubmit,
}: EmailInputFormProps) {
  const { t } = useLocalization();

  return (
    <Animated.View
      key="email-form"
      entering={FadeInRight.duration(400)}
      exiting={FadeOutRight.duration(300)}
    >
      {/* Email Form */}
      <View className="gap-4 mb-6">
        <Controller
          control={control}
          name="email"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextField isInvalid={!!error}>
              <TextField.Label
                className="text-sans text-foreground"
                style={{ fontFamily: "Outfit_500Medium" }}
              >
                {t("auth.emailInput.title")}
              </TextField.Label>
              <TextField.Input
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t("auth.emailInput.emailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                autoFocus
                editable={!isLoading}
                className="h-14 rounded-2xl text-base"
                style={{ fontFamily: "Outfit_400Regular" }}
              />
              <TextField.Description
                style={{ fontFamily: "Outfit_400Regular" }}
              >
                {t("auth.emailInput.description")}
              </TextField.Description>
              <TextField.ErrorMessage>{error?.message}</TextField.ErrorMessage>
            </TextField>
          )}
        />
      </View>

      {/* Continue Button */}
      <Button
        layout={LinearTransition.springify()}
        variant="primary"
        size="lg"
        onPress={onSubmit}
        isDisabled={!isValid || isLoading}
        className="rounded-2xl"
        pressableFeedbackVariant="ripple"
      >
        {isLoading ? (
          <Spinner entering={FadeIn.delay(50)} color="white" />
        ) : (
          <>
            <Button.Label className="font-heading-bold text-white">
              {t("auth.emailInput.continueButton")}
            </Button.Label>
            <StyledHugeIcon
              icon={Mail01Icon}
              size={20}
              className="text-white"
            />
          </>
        )}
      </Button>
    </Animated.View>
  );
}
