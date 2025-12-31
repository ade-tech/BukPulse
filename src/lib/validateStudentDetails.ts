import type { studentSignInParams } from "./types";

export function validateStudentDetails({
  regNumber,
  email,
}: studentSignInParams): boolean {
  const [_, registrationYear, faculty, studentNumber] = regNumber.split("/");
  const [emailFirstPart, emailLastPart] = email.split(".");
  const facInEmail = emailLastPart.slice(0, 3);
  const yearInEmail =
    emailFirstPart.length === 9
      ? emailFirstPart.slice(2, 4)
      : emailFirstPart.slice(3, 5);

  const studentNumberInEmail =
    emailFirstPart.length === 9
      ? emailFirstPart.slice(4, 9)
      : emailFirstPart.slice(5, 10);
  const regNumberIsValid = studentNumber === studentNumberInEmail;
  const facIsValid = facInEmail.toLowerCase() === faculty.toLowerCase();
  const yearIsValid = yearInEmail === registrationYear;

  return regNumberIsValid && facIsValid && yearIsValid;
}

export function changeCOMtoCST(email: string): string {
  const [one, two, three, four] = email.split(".");
  const [_, uni] = two.split("@");
  const facInEmail = two.slice(0, 3);
  console.log(facInEmail);

  if (facInEmail.toLowerCase() === "com") {
    const newemail = `${one}.cst@${uni}.${three}.${four}`;
    return newemail;
  }
  return email;
}

//aaa2100703.com@buk.edu.ng
