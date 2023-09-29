import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";


import { api } from "~/utils/api";

import { LoadingPage, LoadingSpinner } from "~/components/loading";



export default function Home() {

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          
        </div>
      </main>
    </>
  );
}
