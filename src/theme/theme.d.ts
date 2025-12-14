import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    customColors: {
      subtleBackground: string;
      subtleBorder: string;
      hoverBackground: string;
    };
  }

  interface PaletteOptions {
    customColors?: {
      subtleBackground?: string;
      subtleBorder?: string;
      hoverBackground?: string;
    };
  }

  interface TypeText {
    tertiary?: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
    dashed: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

// Extend the theme with custom properties
declare module "@mui/material/styles/createTheme" {
  interface Theme {
    customShadows: {
      small: string;
      medium: string;
      large: string;
    };
  }

  interface ThemeOptions {
    customShadows?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  }
}
