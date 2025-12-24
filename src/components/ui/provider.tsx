"use client";

import { ChakraProvider, type SystemContext } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

interface ProviderProps {
  value: SystemContext;
  children: React.ReactNode;
}

export function Provider({ value, children }: ProviderProps) {
  return (
    <ChakraProvider value={value}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
