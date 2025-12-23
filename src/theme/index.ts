import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./foundations/colors";
import { space } from "./foundations/spacing";
import { radii } from "./foundations/radii";
import { fonts, fontSizes, lineHeights } from "./foundations/typography";
import { shadows } from "./foundations/shadows";
import { semanticTokens } from "./semantic-tokens";

const config = defineConfig({
  theme: {
    tokens: {
      colors,
      spacing: space,
      radii,
      shadows,
      fonts,
      fontSizes,
      lineHeights,
    },
    semanticTokens,
  },
});

export const system = createSystem(defaultConfig, config);
