import { PlatformInterface as Platform } from "@/interfaces/platform.interfaces"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface CustomLink {
    id: number
    url: string
    iconUrl: string | null
}

interface UserData {
    // Prior screens data (assuming these fields based on common onboarding flows)
    email: string
    name: string
    username: string
    password: string
    accountType: string

    // Current screens data
    selectedPlatforms: Platform[]
    customLinks: CustomLink[]
    bio: string
    location: string
    profileImage: string | null

    // Step tracking
    currentStep: number
}

interface UserStore extends UserData {
    setEmail: (email: string) => void
    setName: (name: string) => void
    setUsername: (username: string) => void
    setPassword: (password: string) => void
    setAccountType: (accountType: string) => void

    setSelectedPlatforms: (platforms: Platform[]) => void
    togglePlatform: (platform: Platform) => void
    setCustomLinks: (links: CustomLink[]) => void
    updateCustomLink: (id: number, url: string, iconUrl: string | null) => void
    setBio: (bio: string) => void
    setLocation: (location: string) => void
    setProfileImage: (imageUrl: string | null) => void

    setCurrentStep: (step: number) => void
    nextStep: () => void
    prevStep: () => void

    resetStore: () => void
}

// Initial state
const initialState: UserData = {
    email: "",
    name: "",
    username: "",
    password: "",
    accountType: "",

    selectedPlatforms: [],
    customLinks: [
        { id: 1, url: "", iconUrl: null },
        { id: 2, url: "", iconUrl: null },
        { id: 3, url: "", iconUrl: null },
    ],
    bio: "",
    location: "",
    profileImage: null,

    currentStep: 1,
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState,

            // Prior screens actions
            setEmail: (email) => set({ email }),
            setName: (name) => set({ name }),
            setUsername: (username) => set({ username }),
            setPassword: (password) => set({ password }),
            setAccountType: (accountType) => set({ accountType }),

            // Current screens actions
            setSelectedPlatforms: (selectedPlatforms) => set({ selectedPlatforms }),
            togglePlatform: (platform) =>
                set((state) => {
                    const exists = state.selectedPlatforms.some((p) => p.id === platform.id)
                    if (exists) {
                        return {
                            selectedPlatforms: state.selectedPlatforms.filter((p) => p.id !== platform.id),
                        }
                    } else {
                        return {
                            selectedPlatforms: [...state.selectedPlatforms, platform],
                        }
                    }
                }),
            setCustomLinks: (customLinks) => set({ customLinks }),
            updateCustomLink: (id, url, iconUrl) =>
                set((state) => ({
                    customLinks: state.customLinks.map((link) => (link.id === id ? { ...link, url, iconUrl } : link)),
                })),
            setBio: (bio) => set({ bio }),
            setLocation: (location) => set({ location }),
            setProfileImage: (profileImage) => set({ profileImage }),

            // Step tracking actions
            setCurrentStep: (currentStep) => set({ currentStep }),
            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

            // Reset action
            resetStore: () => set(initialState),
        }),
        {
            name: "abio-user-storage",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)
