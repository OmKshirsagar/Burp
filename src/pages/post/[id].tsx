import Head from "next/head";

import { api } from "~/utils/api";

import { LoadingPage} from "~/components/loading";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";


import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";


type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
const SinglePostPage: NextPage<PageProps> = ({ id }) => {
  const { data, isLoading } = api.posts.getPostById.useQuery({
    id,
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
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("id is not a string");
  await ssg.posts.getPostById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
