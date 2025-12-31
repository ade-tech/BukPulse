import {
  Button,
  Heading,
  HStack,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import { Link, useSearchParams } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import StudentInput from "@/components/ui/studentInputs";
import { useUserSignUp } from "@/hooks/useAuth";
import {
  validateStudentDetails,
} from "@/lib/validateStudentDetails";
import { toaster } from "@/components/ui/toaster";

export interface UserFormInputs {
  email: string;
  regNumber: string;
}

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { signUp, isSigningUp } = useUserSignUp();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<UserFormInputs>({
    mode: "onBlur",
  });

  const SubmitFn: SubmitHandler<UserFormInputs> = ({
    regNumber,
    email,
  }: UserFormInputs) => {
    const canbeValidated = validateStudentDetails({
      regNumber,
      email,
    });

    if (!canbeValidated) {
      toaster.create({
        title: "Login details does not match!",
      });
      return;
    }

    signUp({ email, regNumber });
  };

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
      <Stack mb={10} px={6}>
        <Heading
          textStyle={"2xl"}
          lineHeight={1}
          fontWeight={"bold"}
          color={"accent.primary"}
        >
          {page === 1 ? "Get Started" : "Enter OTP"}
        </Heading>
        <Text
          fontSize={"sm"}
          lineHeight={1.3}
          color={"text.primary"}
          fontWeight={"light"}
        >
          {page === 1
            ? "Sign in to see what's happening in BUK right now."
            : "A one-time passcode has been sent to your email.Please check your inbox and enter the code below."}
        </Text>
      </Stack>
      <form
        className="w-full flex overflow-hidden flex-col gap-4 items-center flex-1"
        onSubmit={handleSubmit(SubmitFn)}
      >
        <StudentInput
          errors={errors}
          name="regNumber"
          type="text"
          placeholder="Enter your Registration  Number"
          pattern={/^[A-Za-z]{3}\/\d{2}\/[A-Za-z]{3}\/\d{5}$/}
          register={register}
          errorText="Enter a correct registration  number"
        />
        <StudentInput
          errors={errors}
          name="email"
          type="email"
          placeholder="Enter your School Mail"
          pattern={/^[a-zA-Z]{2,3}\d{7}\.[a-zA-Z]{3}@buk\.edu\.ng$/}
          register={register}
          errorText="Enter a verified Student Mail"
        />

        <Button
          onClick={handleSubmit(SubmitFn)}
          disabled={isSigningUp}
          w={"11/12"}
          size={"lg"}
          bg={"accent.primary"}
          rounded={"lg"}
        >
          Sign In
        </Button>
      </form>
      {page === 1 && (
        <HStack mb={48} mx={"auto"}>
          <Text mx={"auto"} fontSize={"sm"}>
            Want to moderate?
          </Text>
          <Link to={"/admin/login"}>
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
