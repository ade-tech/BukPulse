import {
  Button,
  Field,
  Heading,
  HStack,
  Link as ChakraLink,
  PinInput,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import { Link, useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import AdminInputs from "@/components/ui/adminInputs";
import { useverifyAdminOTP } from "@/hooks/useAuth";

export interface AdminFormInputs {
  email: string;
  otp: string[];
}

export default function AdminLogin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { verifyOTP } = useverifyAdminOTP();

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
      <Stack mx={"auto"} flexBasis={"1/5"} px={6}>
        <Heading
          textStyle={"2xl"}
          lineHeight={1}
          fontWeight={"bold"}
          color={"accent.primary"}
          textAlign={"center"}
        >
          {page === 1 ? "Moderator Sign In" : "We've sent you a code"}
        </Heading>
        <Text
          fontSize={"sm"}
          lineHeight={1.3}
          color={"text.primary"}
          fontWeight={"light"}
          textAlign={"center"}
        >
          {page === 1
            ? "Sign in to moderate content, manage users, and maintain platform standards."
            : `Enter it below to verify\n${getValues("email")}`}
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
                    mx={"auto"}
                    size={"xl"}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    onValueComplete={() => {
                      const email = getValues("email");
                      const tokenString = getValues("otp").join("");
                      verifyOTP({ email, token: tokenString });
                    }}
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
        <HStack mb={48} mx={"auto"}>
          <Text mx={"auto"} fontSize={"sm"}>
            Not a moderator?
          </Text>
          <Link to={"/login"}>
            <Text fontSize={"sm"} color={"accent.primary"} fontWeight={"bold"}>
              Sign In here
            </Text>
          </Link>
        </HStack>
      )}

      <Text mx={"auto"} mb={5} px={4} fontSize={"2xs"} textAlign={"center"}>
        © 2025 BukPulse. All rights reserved. Your data is handled securely and
        in accordance with our{" "}
        <ChakraLink fontWeight={"semibold"} color={"accent.primary"}>
          privacy policy.
        </ChakraLink>
      </Text>
    </Stack>
  );
}
