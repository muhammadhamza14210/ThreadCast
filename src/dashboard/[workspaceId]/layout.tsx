import { onAuthenticateUser } from "@/action/user";
import { hasAccessToWorkspace } from "@/action/workspace";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { workSpaceId: string };
  children: React.ReactNode;
};

const Layout = async ({ params: { workSpaceId }, children }: Props) => {
  const auth = await onAuthenticateUser();
  if (!auth.user?.workSpace) redirect("/auth/sign-in");
  if (!auth.user.workSpace.length) redirect("/auth/sign-in");
  const hasAccess = await hasAccessToWorkspace(workSpaceId);
};

export default Layout;
