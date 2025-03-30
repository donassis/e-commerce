'use server'
import { signIn, signOut} from '@/auth'
import {IUserSignIn, IUserSignUp} from '@/types'
import {redirect} from "next/navigation";
import {UserSignUpSchema} from "@/lib/validator";
import {connectToDatabase} from "@/lib/db";
import User from "@/lib/db/models/user.model";
import {formatError} from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}

// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    await connectToDatabase()
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    })
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}
//
// // DELETE
//
// export async function deleteUser(id: string) {
//   try {
//     await connectToDatabase()
//     const res = await User.findByIdAndDelete(id)
//     if (!res) throw new Error('Use not found')
//     revalidatePath('/admin/users')
//     return {
//       success: true,
//       message: 'User deleted successfully',
//     }
//   } catch (error) {
//     return { success: false, message: formatError(error) }
//   }
// }
// // UPDATE
//
// export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
//   try {
//     await connectToDatabase()
//     const dbUser = await User.findById(user._id)
//     if (!dbUser) throw new Error('User not found')
//     dbUser.name = user.name
//     dbUser.email = user.email
//     dbUser.role = user.role
//     const updatedUser = await dbUser.save()
//     revalidatePath('/admin/users')
//     return {
//       success: true,
//       message: 'User updated successfully',
//       data: JSON.parse(JSON.stringify(updatedUser)),
//     }
//   } catch (error) {
//     return { success: false, message: formatError(error) }
//   }
// }
// export async function updateUserName(user: IUserName) {
//   try {
//     await connectToDatabase()
//     const session = await auth()
//     const currentUser = await User.findById(session?.user?.id)
//     if (!currentUser) throw new Error('User not found')
//     currentUser.name = user.name
//     const updatedUser = await currentUser.save()
//     return {
//       success: true,
//       message: 'User updated successfully',
//       data: JSON.parse(JSON.stringify(updatedUser)),
//     }
//   } catch (error) {
//     return { success: false, message: formatError(error) }
//   }
// }


