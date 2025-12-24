import { Image } from "@chakra-ui/react";
import { useColorModeValue } from "./color-mode";

export default function Logo() {
  const src = useColorModeValue(
    "/HorizontalLogoBbukp.svg",
    "/HorizontalLogoWbukp.svg"
  );

  return (
    <Image
      src={src}
      alt="BukPulse"
      loading="eager"
      decoding="async"
      fetchPriority="high"
      display="block"
      w={140}
      pt={2}
      pl={2}
      draggable={false}
    />
  );
}
