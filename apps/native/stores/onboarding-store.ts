import { create } from "zustand";

interface OnboardingState {
  // Step 1: Identity
  displayName: string;
  gender: "MALE" | "FEMALE" | undefined;
  dateOfBirth: Date | undefined;

  // Step 2: Location & Type
  profileType: "individual" | "enterprise" | undefined;
  country: string;
  city: string;
  address: string;

  // Step 3: Preferences
  preferredLanguage: string;
  preferredCurrency: string;

  // Step 4: Images (Optional for now, but good to have)
  idCardImageUri: string | undefined;
  profileImageUri: string | undefined;

  // Actions
  setIdentity: (data: {
    displayName: string;
    gender: "MALE" | "FEMALE";
    dateOfBirth: Date;
  }) => void;
  setLocationAndType: (data: {
    profileType: "individual" | "enterprise";
    country: string;
    city: string;
    address: string;
  }) => void;
  setPreferences: (data: {
    preferredLanguage: string;
    preferredCurrency: string;
  }) => void;
  setIdCardImage: (uri: string) => void;
  setProfileImage: (uri: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  displayName: "",
  gender: undefined,
  dateOfBirth: undefined,
  profileType: undefined,
  country: "",
  city: "",
  address: "",
  preferredLanguage: "",
  preferredCurrency: "",
  idCardImageUri: undefined,
  profileImageUri: undefined,

  setIdentity: (data) => set((state) => ({ ...state, ...data })),
  setLocationAndType: (data) => set((state) => ({ ...state, ...data })),
  setPreferences: (data) => set((state) => ({ ...state, ...data })),
  setIdCardImage: (uri) => set((state) => ({ ...state, idCardImageUri: uri })),
  setProfileImage: (uri) =>
    set((state) => ({ ...state, profileImageUri: uri })),
  reset: () =>
    set({
      displayName: "",
      gender: undefined,
      dateOfBirth: undefined,
      profileType: undefined,
      country: "",
      city: "",
      address: "",
      preferredLanguage: "",
      preferredCurrency: "",
      idCardImageUri: undefined,
      profileImageUri: undefined,
    }),
}));
