import Head from "next/head";
import Image from "next/image";

import { api } from "~/utils/api";

import { LoadingPage} from "~/components/loading";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";


import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";

const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.posts.getPostByUserId.useQuery({userId: props.userId});
  if (isLoading) return <LoadingPage/>;

  if (!data || data.length === 0) return <div className="flex">No posts yet!</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id}/>
        ))};
    </div>
  )
}

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) {
    console.log("loading");
    return <LoadingPage />;
  }

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>Profile Page</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            className="rounded-full -mb-[64px] ml-4 absolute bottom-0 left-0 border-4 border-black"
            src={data.imageUrl}
            alt={`${data.username}'s profile picture`}
            width={128}
            height={128}
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={data.id}/>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("slug is not a string");
  const username = slug.replace("@", "");
  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
