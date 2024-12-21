import { currentUser } from "@clerk/nextjs/server";

`use server`;

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};
