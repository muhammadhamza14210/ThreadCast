import { onAuthenticateUser, getNotifications } from "@/action/user";
import {
  getWorkspaceFolders,
  hasAccessToWorkspace,
  getAllUserVideos,
  getWorkSpaces
} from "@/action/workspace";

import { redirect } from "next/navigation";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate
} from "@tanstack/react-query";
import React from "react";
import Sidebar from "@/components/global/sidebar";

type Props = {
  params: { workSpaceId: string };
  children: React.ReactNode;
};

const Layout = async ({ params: { workSpaceId }, children }: Props) => {
  const auth = await onAuthenticateUser();
  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user.workspace.length) redirect("/auth/sign-in");
  const hasAccess = await hasAccessToWorkspace(workSpaceId);
  if (hasAccess.status !== 200)
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  if (!hasAccess.data?.workSpace) return null;

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workSpaceId)
  });

  await query.prefetchQuery({
    queryKey: ["user-videos"],
    queryFn: () => getAllUserVideos(workSpaceId)
  });

  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces()
  });

  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications()
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar actionWorkSpaceId = {workSpaceId}/>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
