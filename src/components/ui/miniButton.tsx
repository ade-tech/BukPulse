import type { MiniButtonProps } from "@/lib/types";
import { Button } from "@chakra-ui/react";

export default function MiniButton({
  onClick,
  children,
  disabled,
  ...props
}: MiniButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={"outline"}
      size={"xs"}
      disabled={disabled}
      ml={5}
      rounded={"full"}
      {...props}
    >
      {children}
    </Button>
  );
}
