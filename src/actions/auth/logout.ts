'use server';

import { signOut } from '@/auth.config';
// import { redirect } from 'next/navigation';


export async function logout(){

  await signOut();
  // redirect("/auth/login");


}