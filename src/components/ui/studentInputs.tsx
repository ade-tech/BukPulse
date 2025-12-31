import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Stack, Field, Input } from "@chakra-ui/react";
import type { UserFormInputs } from "@/pages/login";

interface FieldProps {
  register: UseFormRegister<UserFormInputs>;
  pattern: RegExp;
  errorText: string;
  name: keyof UserFormInputs;
  errors: FieldErrors<UserFormInputs>;
  type: "text" | "email";
  placeholder: string;
}
export default function StudentInput({
  errors,
  name,
  errorText,
  type,
  register,
  placeholder,
  pattern,
}: FieldProps) {
  return (
    <Stack
      w={"11/12"}
      gap={4}
      _open={{
        animation: "400ms fadeIn  ease-out ",
      }}
      _closed={{
        animation: "400ms fadeOut  ease-out ",
      }}
    >
      <Field.Root w={"full"} invalid={!!errors.email}>
        <Input
          {...register(name, {
            required: errorText,
            validate: (input) => {
              return pattern?.test(input) || errorText;
            },
          })}
          rounded={"lg"}
          size={"xl"}
          color={"accent.primary"}
          focusRing={"none"}
          _focus={{
            outline: "none",
            border: "none",
          }}
          bg={"bg.surface"}
          placeholder={placeholder}
          _placeholder={{
            fontSize: "sm",
            color: " bg.page",
            fontWeight: "light",
          }}
          type={type}
          name={name}
        />
        {errors[name] && <Field.ErrorText>{errorText}</Field.ErrorText>}
      </Field.Root>
    </Stack>
  );
}
