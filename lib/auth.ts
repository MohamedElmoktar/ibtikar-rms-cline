import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";
import User from "./models/User";

export async function authenticateUser(username: string, password: string) {
  try {
    await dbConnect();

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    await dbConnect();
    const user = await User.findById(userId);
    return user?.role === "Admin";
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}

export async function getUserById(userId: string) {
  try {
    await dbConnect();
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
