import { Button, Icon } from "@chakra-ui/react";
import { LuArrowUpFromDot } from "react-icons/lu";

interface newButtonProps {
  to: () => void;
}
export default function NewPostButton({ to }: newButtonProps) {
  return (
    <Button
      onClick={to}
      pos={"fixed"}
      top={20}
      left={"50%"}
      transform={"translateX(-50%)"}
      bg={"accent.primary"}
      rounded={"full"}
      boxShadow={"0 10px 40px rgba(0, 0, 0, 0.3)"}
      zIndex={50}
    >
      <Icon>
        <LuArrowUpFromDot />
      </Icon>
      New Posts
    </Button>
  );
}
