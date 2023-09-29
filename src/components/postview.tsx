import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import type { RouterOutputs } from "~/utils/api";
import Link from "next/link";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
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
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span>·</span>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">
              {dayjs(post.createdAt as Date).fromNow()}
            </span>
          </Link>
        </div>
        <div className="flex">
          <span className="text-xl">{post.content}</span>
        </div>
      </div>
    </div>
  );
};