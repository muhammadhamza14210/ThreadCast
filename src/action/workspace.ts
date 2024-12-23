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

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const folders = await client.folder.findMany({
      where: {
        workSpaceId: workSpaceId
      },
      include: {
        _count: {
          select: {
            videos: true
          }
        }
      }
    });
    if (folders && folders.length > 0) {
      return {
        status: 200,
        data: folders
      };
    }
    return {
      status: 404,
      data: []
    };
  } catch (error) {
    return {
      status: 403,
      data: []
    };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  const user = currentUser();
  if (!user) return { status: 404 };
  try {
    const videos = await client.video.findMany({
      where: {
        OR: [{ workSpaceId: workSpaceId }, { folderId: workSpaceId }]
      },
      select: {
        id: true,
        title: true,
        source: true,
        createdAt: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true
          }
        },
        User: {
          select: {
            image: true,
            firstname: true,
            lastname: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });
    if (videos && videos.length > 0) {
      return {
        status: 200,
        data: videos
      };
    }
    return {
      status: 404
    };
  } catch (error) {
    return { status: 400 };
  }
};

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const workspace = await client.user.findUnique({
      where: {
        clerkid: user.id
      },
      select: {
        subscription: {
          select: {
            plan: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        }
      }
    });
    if (workspace) {
      return {
        status: 200,
        data: workspace
      };
    }
  } catch (error) {
    return { status: 400 };
  }
};
