import { onAuthenticateUser } from "@/action/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const AuthCallbackpage = async (props: Props) => {
  //Authentication
  const auth = await onAuthenticateUser();
  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.workSpace[0].id}`);
  }

  if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
    return redirect("/auth/sign-in");
  }
};

export default AuthCallbackpage;
