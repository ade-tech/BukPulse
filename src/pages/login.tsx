import {
  Button,
  Heading,
  HStack,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import StudentInput from "@/components/ui/studentInputs";
import { useUserSignUp } from "@/hooks/useAuth";
import { validateStudentDetails } from "@/lib/validateStudentDetails";
import { toaster } from "@/components/ui/toaster";

export interface UserFormInputs {
  email: string;
  regNumber: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/";
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

    signUp(
      { email, regNumber },
      {
        onSuccess: ({ profile }) => {
          toaster.create({ title: `Hello, ${profile?.name}` });
          if (profile) navigate("/onboarding");
          else navigate(from, { replace: true });
        },
        onError: (error: any) => {
          toaster.create({ title: error?.message ?? "Login failed" });
        },
      }
    );
  };

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
      <Stack mb={10} px={6}>
        <Heading
          textStyle={"2xl"}
          lineHeight={1}
          fontWeight={"bold"}
          textAlign={"center"}
          color={"accent.primary"}
        >
          Get Started
        </Heading>
        <Text
          fontSize={"sm"}
          lineHeight={1.3}
          color={"text.primary"}
          textAlign={"center"}
          fontWeight={"light"}
        >
          Sign in to see what's happening in BUK right now.
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
