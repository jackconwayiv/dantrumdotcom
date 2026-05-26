import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Fredoka One', cursive",
    body: "'Quicksand', sans-serif",
  },
  colors: {
    brand: {
      50: "#F3E5F5",
      100: "#E1BEE7",
      200: "#CE93D8",
      300: "#BA68C8",
      400: "#AB47BC",
      500: "#9C27B0",
      600: "#7B1FA2",
      700: "#6A1B9A",
      800: "#4A148C",
      900: "#38006B",
    },
    oasis: {
      bg: "#FAFAFA",
      surface: "#FFFFFF",
      gray: "#CBD1D8",
      text: "#333333",
      green: {
        50: "#E8F5E9",
        100: "#C8E6C9",
        200: "#A5D6A7",
        300: "#81C784",
        400: "#66BB6A",
        500: "#00A878",
        600: "#007D5A",
        700: "#00695C",
        800: "#004D40",
        900: "#00332A",
      },
      orange: {
        50: "#FFF3E0",
        100: "#FFE0B2",
        200: "#FFCC80",
        300: "#FFB74D",
        400: "#FFA726",
        500: "#F37042",
        600: "#D84315",
        700: "#BF360C",
        800: "#E65100",
        900: "#E65100",
      },
    },
  },
  semanticTokens: {
    colors: {
      "chakra-body-bg": "oasis.bg",
      "chakra-body-text": "oasis.text",
      "chakra-border-color": "oasis.gray",
    },
  },
  radii: {
    card: "20px",
    panel: "24px",
  },
  shadows: {
    card: "0 8px 24px rgba(0, 0, 0, 0.04)",
    panel: "0 10px 30px rgba(0, 0, 0, 0.04)",
  },
  styles: {
    global: {
      body: {
        bg: "oasis.bg",
        color: "oasis.text",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: "full",
      },
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        primary: {
          bg: "brand.500",
          color: "white",
          _hover: { bg: "brand.600" },
        },
        success: {
          bg: "oasis.green.500",
          color: "white",
          _hover: { bg: "oasis.green.600" },
        },
        cta: {
          bg: "oasis.orange.500",
          color: "white",
          _hover: { bg: "oasis.orange.600" },
        },
        soft: {
          bg: "brand.100",
          color: "brand.600",
          _hover: { bg: "brand.200" },
        },
        outline: {
          bg: "transparent",
          border: "1px solid",
          borderColor: "oasis.gray",
          color: "oasis.text",
          _hover: { bg: "gray.50" },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "heading",
        fontWeight: "normal",
        color: "brand.500",
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "card",
          borderColor: "oasis.gray",
          borderWidth: "1px",
          boxShadow: "card",
          bg: "oasis.surface",
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: "panel",
          borderColor: "oasis.gray",
          boxShadow: "panel",
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
      baseStyle: {
        field: {
          borderRadius: "lg",
          borderColor: "oasis.gray",
        },
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
      baseStyle: {
        borderRadius: "lg",
        borderColor: "oasis.gray",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
      baseStyle: {
        field: {
          borderRadius: "lg",
          borderColor: "oasis.gray",
        },
      },
    },
    Link: {
      baseStyle: {
        color: "brand.500",
        _hover: { color: "brand.600", textDecoration: "underline" },
      },
    },
  },
});

export default theme;
