export const Input = {
  baseStyle: {
    width: "100%",
    minHeight: "40px",
    fontSize: "md",
    paddingX: 4,
    paddingY: 2,
    borderRadius: "md",
    transition: "all 0.2s",
    border: "1px solid",
    borderColor: "border.default",
    _focus: {
      borderColor: "accent.primary",
      boxShadow: "0 0 0 1px",
      boxShadowColor: "accent.primary",
    },
    _placeholder: {
      color: "text.secondary",
    },
  },
  defaultVariant: "outline",
};
