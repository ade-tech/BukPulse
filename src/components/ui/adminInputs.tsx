import type { AdminFormInputs } from "@/pages/adminLogin";
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
  resendTimeout: () => void;
}

/**
 * Renders an email input and Next button that validate the address, verify admin eligibility, send an OTP, and close the input UI on success.
 *
 * @param onClick - Callback invoked after a successful eligibility check and UI close.
 * @param trigger - Form trigger function used to validate the `email` field.
 * @param register - Form register function used to bind the `email` input.
 * @param errors - Form field errors for displaying validation feedback.
 * @param getValues - Function to read current form values, used to obtain the `email`.
 * @param resendTimeout - Starts the resend timeout when an OTP has been sent.
 * @returns The admin email input form UI.
 */
export default function AdminInputs({
  onClick,
  register,
  errors,
  getValues,
  trigger,
  resendTimeout,
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
        } else {
          toaster.create({
            title: "OTP has been sent!",
          });
        }
        resendTimeout();
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