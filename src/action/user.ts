import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

`use server`;

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }
    const existingUser = await client.user.findUnique({
      where: {
        clerkid: user.id
      },
      include: {
        workSpace: {
          where: {
            User: {
              clerkid: user.id
            }
          }
        }
      }
    });
    if (existingUser) {
      return { status: 200, user: existingUser };
    }
    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {}
        },
        workSpace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL"
          }
        }
      },
      include: {
        workSpace: {
          where: {
            User: {
              clerkid: user.id
            },
          },
        },
        subscription: {
          select: {
            plan: true
          },
        },
      },
    });
    if (newUser) {
      return { status: 201, user: newUser };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 500 };
  }
};
