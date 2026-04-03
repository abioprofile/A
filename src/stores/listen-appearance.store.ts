import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ButtonStyle } from "@/types/appearance.types";
import type { FontStyle } from "@/components/FontCustomizer";

export interface ListenAppearanceState {
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  /** Same format as selectedTheme: "fill:#hex" | "gradient:#a:#b" | image-url */
  background: string;
  setButtonStyle: (style: ButtonStyle) => void;
  setFontStyle: (style: FontStyle) => void;
  setBackground: (bg: string) => void;
  reset: () => void;
}

const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  borderRadius: "0px",
  backgroundColor: "rgba(255,255,255,0.08)",
  borderColor: "#ffffff30",
  opacity: 1,
  boxShadow: "none",
};

const DEFAULT_FONT_STYLE: FontStyle = {
  fontFamily: "Poppins",
  fillColor: "#ffffff",
  strokeColor: "none",
  opacity: 100,
  fontWeight: "400",
  fontSize: 13,
  fontStyle: "normal",
  textDecoration: "none",
};

const DEFAULT_BACKGROUND = "fill:#0d0d0d";

const initialState = {
  buttonStyle: DEFAULT_BUTTON_STYLE,
  fontStyle: DEFAULT_FONT_STYLE,
  background: DEFAULT_BACKGROUND,
};

export const useListenAppearanceStore = create<ListenAppearanceState>()(
  persist(
    (set) => ({
      ...initialState,
      setButtonStyle: (buttonStyle) => set({ buttonStyle }),
      setFontStyle: (fontStyle) => set({ fontStyle }),
      setBackground: (background) => set({ background }),
      reset: () => set(initialState),
    }),
    {
      name: "abio-listen-appearance",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Parse background string to a CSS style object */
export function listenBgToStyle(bg: string): React.CSSProperties {
  if (bg.startsWith("fill:")) {
    return { backgroundColor: bg.slice(5) };
  }
  if (bg.startsWith("gradient:")) {
    const [, start, end] = bg.split(":");
    return {
      backgroundImage: `linear-gradient(to bottom, ${start ?? "#0d0d0d"}, ${end ?? "#1a1a1a"})`,
    };
  }
  if (bg) {
    return {
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: "#0d0d0d" };
}
