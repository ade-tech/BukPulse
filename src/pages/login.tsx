import {
  Button,
  Field,
  Heading,
  Link,
  PinInput,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import AdminInputs from "@/components/ui/adminInputs";

export interface AdminFormInputs {
  email: string;
  otp: string[];
}

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    control,
    trigger,
    formState: { errors },
    getValues,
    setValue,
    register,
  } = useForm<AdminFormInputs>({
    mode: "onChange",
  });
  const page = Number(searchParams.get("page")) || 1;
  return (
    <Stack
      bg={"bg.page"}
      w={"full"}
      h={"full"}
      display={"flex"}
      alignItems={"start"}
      pos={"relative"}
      pt={32}
    >
      {page === 2 && (
        <Button
          onClick={() => {
            setSearchParams({ page: "1" });
            setValue("otp", []);
          }}
          variant={"outline"}
          top={10}
          pos={"absolute"}
          size={"xs"}
          rounded={"full"}
        >
          <HiArrowLeft />
          Back
        </Button>
      )}
      <Stack flexBasis={"1/5"}>
        <Heading
          textStyle={"2xl"}
          lineHeight={1}
          fontWeight={"bold"}
          color={"accent.primary"}
        >
          {page === 1 ? "Moderator Sign In" : "Enter OTP"}
        </Heading>
        <Text
          fontSize={"sm"}
          lineHeight={1.3}
          color={"text.primary"}
          fontWeight={"light"}
        >
          {page === 1
            ? "Sign in to moderate content, manage users, and maintain platform standards."
            : "A one-time passcode has been sent to your email.Please check your inbox and enter the code below."}
        </Text>
      </Stack>
      <form className="w-full flex overflow-hidden flex-col gap-4 items-center flex-1 pt-24">
        {page === 1 && (
          <AdminInputs
            errors={errors}
            register={register}
            trigger={trigger}
            getValues={getValues}
            onClick={() => {
              setSearchParams({ page: "2" });
            }}
          />
        )}
        {page === 2 && (
          <Stack w={"11/12"} alignItems={"center"} justifyContent={"center"}>
            <Field.Root w={"full"}>
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <PinInput.Root
                    size={"xl"}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                  >
                    <PinInput.HiddenInput />
                    <PinInput.Control w={"full"} ml={4}>
                      <PinInput.Input index={0} />
                      <PinInput.Input index={1} />
                      <PinInput.Input index={2} />
                      <PinInput.Input index={3} />
                      <PinInput.Input index={4} />
                      <PinInput.Input index={5} />
                    </PinInput.Control>
                  </PinInput.Root>
                )}
              />
            </Field.Root>
          </Stack>
        )}
      </form>
      {page === 1 && (
        <Text mx={"auto"} mb={32} fontSize={"sm"}>
          Not a Moderator?{" "}
          <Link fontWeight={"semibold"} color={"accent.primary"}>
            Sign In here
          </Link>
        </Text>
      )}

      <Text mx={"auto"} mb={5} fontSize={"xs"} textAlign={"center"}>
        © 2025 BukPulse. All rights reserved. Your data is handled securely and
        in accordance with our{" "}
        <Link fontWeight={"semibold"} color={"accent.primary"}>
          privacy policy.
        </Link>
      </Text>
    </Stack>
  );
}
