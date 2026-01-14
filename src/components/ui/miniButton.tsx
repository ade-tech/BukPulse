import type { MiniButtonProps } from "@/lib/types";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function MiniButton({
  onClick,
  children,
  disabled,
  ...props
}: MiniButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      onClick={onClick ? onClick : () => navigate(-1)}
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
