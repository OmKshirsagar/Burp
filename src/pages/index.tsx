import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const user = useUser();
  const [input, setInput] = useState("");

  if (!user.isSignedIn) {
    return <div className="flex">Sign in to create a post</div>;
  }

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMsg = e.data?.zodError?.fieldErrors.content;

      if (errorMsg?.[0]) {
        toast.error(errorMsg[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  console.log(user.user);
  return (
    <div className="flex w-full gap-3">
      <Image
        className="h-14 w-14 rounded-full"
        src={user.user.imageUrl}
        alt="Profile Image"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emoji's"
        type="text"
        value={input}
        className="grow bg-transparent outline-none"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />

      {input !== "" && !isPosting && (
        <button
          className="my-3 rounded-md bg-slate-300 p-2 text-slate-700"
          onClick={() => {
            mutate({ content: input });
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};



const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;
  return (
    <div className="flex flex-col">
      {[...data]?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const { data } = api.posts.getAll.useQuery();
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b p-4 text-white">
        {!isSignedIn && (
          <div className="flex w-full justify-between">
            <CreatePostWizard></CreatePostWizard>
            <div className="flex">
              <SignInButton></SignInButton>
            </div>
          </div>
        )}
        {isSignedIn && (
          <>
            <CreatePostWizard></CreatePostWizard>
            <div className="flex min-w-fit pl-2">
              <SignOutButton></SignOutButton>
            </div>
          </>
        )}
      </div>
      <Feed />
    </PageLayout>
  );
}
