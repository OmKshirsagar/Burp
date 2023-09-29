import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="h-fit min-h-full w-full border border-x border-slate-400 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};