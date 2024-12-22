"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const hasAccessToWorkspace = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };
    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workSpaceId,
        OR: [
          {
            User: {
              clerkid: user.id
            }
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id
                }
              }
            }
          }
        ]
      }
    });
    return {
      status: 200,
      data: { workSpace: isUserInWorkspace }
    };
  } catch (error) {
    return {
      status: 200,
      data: { workSpace: null }
    };
  }
};
