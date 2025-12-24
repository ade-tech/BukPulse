import type { AdminFormInputs } from "@/pages/login";
import { Button, Field, Input, Spinner, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useCheckAdminAddressValidity } from "@/hooks/useAuth";
import { toaster } from "@/components/ui/toaster";
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";

interface AdminInputsProps {
  onClick: () => void;
  trigger: UseFormTrigger<AdminFormInputs>;
  register: UseFormRegister<AdminFormInputs>;
  errors: FieldErrors<AdminFormInputs>;
  getValues: UseFormGetValues<AdminFormInputs>;
}

export default function AdminInputs({
  onClick,
  register,
  errors,
  getValues,
  trigger,
}: AdminInputsProps) {
  const { checkValidity, isCheckingValidity } = useCheckAdminAddressValidity();
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const triggerFn = async () => {
    const isValid = await trigger(["email"]);
    if (!isValid) return;
    const email = getValues("email");
    checkValidity(email, {
      onSuccess: (data) => {
        if (!data.allowed) {
          toaster.create({
            title: "UnAuthorized Email",
          });
          return;
        }else {
          toaster.create({
            title: "OTP has been sent!",
          });
        }
        setIsClosing(true);
        setTimeout(() => {
          setIsClosed(true);
        }, 350);
        onClick();
      },
      onError: () => {
        toaster.create({
          title: "UnAuthorized Email",
        });
      },
    });
  };
  return (
    <Stack
      w={"11/12"}
      display={isClosed ? "none" : "flex"}
      gap={4}
      data-state={isClosing ? "closed" : "open"}
      _open={{
        animation: "400ms fadeIn  ease-out ",
      }}
      _closed={{
        animation: "400ms fadeOut  ease-out ",
      }}
    >
      <Field.Root w={"full"} invalid={!!errors.email}>
        <Stack w={"full"} pos={"relative"}>
          {isCheckingValidity && (
            <Spinner
              pos={"absolute"}
              zIndex={2}
              size={"sm"}
              top={"30%"}
              transform={"translateY(-50%)"}
              right={5}
              color={"accent.primary"}
            />
          )}
          <Input
            {...register("email", {
              required: "Enter a Valid Email Address",
              validate: (value) => {
                const pattern =
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return pattern.test(value) || "Enter a valid Email Address";
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
            placeholder="Enter your verifed Email"
            _placeholder={{
              fontSize: "sm",
              color: " bg.page",
              fontWeight: "light",
            }}
          />
        </Stack>
        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
      </Field.Root>
      <Button
        onClick={triggerFn}
        disabled={isCheckingValidity}
        w={"full"}
        size={"lg"}
        bg={"accent.primary"}
        rounded={"lg"}
      >
        Next
      </Button>
    </Stack>
  );
}
