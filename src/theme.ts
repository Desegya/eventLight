import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  colors: {
    brand: {
      50: "#F5F3FF",
      100: "#EDE9FE",
      200: "#DDD6FE",
      300: "#C4B5FD",
      400: "#A78BFA",
      500: "#8B5CF6",
      600: "#7C3AED",
      700: "#6D28D9",
      800: "#5B21B6",
      900: "#4C1D95",
    },
    accent: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",
      600: "#D97706",
      700: "#B45309",
    },
    gray: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
        color: props.colorMode === "dark" ? "gray.100" : "gray.900",
      },
      "*": {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        letterSpacing: "-0.01em",
        _focus: { boxShadow: "0 0 0 3px rgba(139,92,246,0.4)" },
      },
      variants: {
        brand: {
          bg: "brand.600",
          color: "white",
          _hover: {
            bg: "brand.700",
            transform: "translateY(-1px)",
            boxShadow: "0 8px 25px rgba(124,58,237,0.4)",
            _disabled: { transform: "none", boxShadow: "none" },
          },
          _active: { bg: "brand.800", transform: "translateY(0)" },
          transition: "all 0.2s ease",
        },
        "brand-outline": {
          bg: "transparent",
          color: "brand.600",
          border: "1.5px solid",
          borderColor: "brand.600",
          _hover: {
            bg: "brand.50",
            transform: "translateY(-1px)",
          },
          _active: { bg: "brand.100", transform: "translateY(0)" },
          transition: "all 0.2s ease",
        },
      },
    },
    Input: {
      variants: {
        filled: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === "dark" ? "gray.800" : "gray.100",
            border: "1.5px solid transparent",
            _hover: {
              bg: props.colorMode === "dark" ? "gray.700" : "gray.200",
            },
            _focus: {
              bg: props.colorMode === "dark" ? "gray.800" : "white",
              borderColor: "brand.500",
              boxShadow: "0 0 0 3px rgba(139,92,246,0.15)",
            },
            _placeholder: {
              color: props.colorMode === "dark" ? "gray.500" : "gray.400",
            },
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          borderRadius: "2xl",
          overflow: "hidden",
          border: "1px solid",
          borderColor: props.colorMode === "dark" ? "gray.700" : "gray.100",
          transition: "all 0.25s ease",
        },
      }),
    },
    Heading: {
      baseStyle: {
        letterSpacing: "-0.03em",
        fontWeight: "700",
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "600",
        textTransform: "none",
        letterSpacing: "0",
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: "md",
          _checked: {
            bg: "brand.600",
            borderColor: "brand.600",
            _hover: { bg: "brand.700", borderColor: "brand.700" },
          },
          _focus: { boxShadow: "0 0 0 3px rgba(139,92,246,0.3)" },
        },
      },
    },
  },
});

export default theme;
