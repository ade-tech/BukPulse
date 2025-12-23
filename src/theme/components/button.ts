export const Button = {
  baseStyle: {
    fontWeight: 600,
    borderRadius: "md",
    transition: "all 0.2s",
  },
  variants: {
    primary: {
      bg: "accent.primary",
      color: "white",
      _hover: {
        bg: "accent.primary.hover",
        transform: "translateY(-2px)",
        boxShadow: "md",
      },
      _active: {
        bg: "accent.primary.active",
        transform: "translateY(0)",
      },
    },
    outline: {
      border: "1px solid",
      borderColor: "border.default",
      color: "accent.primary",
      _hover: {
        bg: "bg.muted",
      },
      _active: {
        bg: "border.default",
      },
    },
  },
  defaultVariant: "primary",
};
