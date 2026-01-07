import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { lastLoginMethodClient } from "better-auth/client/plugins";

import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "https://be-ntc.com",
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
    emailOTPClient(),
    convexClient(),
    lastLoginMethodClient(),
    //inferAdditionalFields<typeof auth>(),
    //customSessionClient<typeof auth>(),
  ],
});

export type Session = typeof authClient.$Infer.Session;

export const { signUp, signIn, signOut, useSession } = authClient;
