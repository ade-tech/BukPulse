import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { Field, Input, type InputProps } from "@chakra-ui/react";

interface GeneralInputProps<T extends FieldValues>
  extends Omit<InputProps, "name" | "type" | "pattern"> {
  register: UseFormRegister<T>;
  pattern?: RegExp;
  errorText: string;
  name: Path<T>;
  errors: FieldErrors<T>;
  type?: "text" | "email" | "password" | "number" | "date" | "time";
  placeholder: string;
}

export default function GeneralInput<T extends FieldValues>({
  errors,
  name,
  errorText,
  type = "text",
  register,
  placeholder,
  pattern,
  ...props
}: GeneralInputProps<T>) {
  return (
    <Field.Root w={"full"} invalid={!!errors[name]}>
      <Input
        {...register(name, {
          required: errorText,
          ...(pattern && {
            validate: (input) => {
              return pattern.test((input as string).trim()) || errorText;
            },
          }),
        })}
        rounded={"lg"}
        size={"xl"}
        fontSize={"sm"}
        color={"text.primary"}
        focusRing={"none"}
        _focus={{
          outline: "none",
          border: "none",
        }}
        bg={"bg.surface"}
        {...props}
        placeholder={placeholder}
        _placeholder={{
          fontSize: "sm",
          color: "text.secondary",
          fontWeight: "light",
        }}
        type={type}
      />
      {errors[name] && <Field.ErrorText>{errorText}</Field.ErrorText>}
    </Field.Root>
  );
}
