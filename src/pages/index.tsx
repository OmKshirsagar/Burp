import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";

const CreatePostWizard = () => {
  const user = useUser();
  if (!user.isSignedIn) {
    return <div>Sign in to create a post</div>;
  }
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
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        className="flex h-14 w-14 rounded-full"
        src={author.imageUrl}
        alt={`${author.username}'s Profile Image`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-400">
          <span>{`@${author.username}`}</span>·
          <span className="font-thin">{dayjs(post.createdAt!).fromNow()}</span>
        </div>
        <div className="flex">
          <span>{post.content}</span>
        </div>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;
  return (
    <div className="flex flex-col">
      {[...data, ...data]?.map((fullPost) => (
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
    <>
      <Head>
        <title>Burp HomePage</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b p-4 text-2xl text-white">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton></SignInButton>
              </div>
            )}
            {isSignedIn && (
              <>
                <CreatePostWizard></CreatePostWizard>
                <SignOutButton></SignOutButton>
              </>
            )}
          </div>
          <Feed/>
        </div>
      </main>
    </>
  );
}
