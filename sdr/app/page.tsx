// TODO:
// - [ ] force calendar layout
// - [ ] add fairness API from round robin
// - [ ] make next and prev button work
// - [ ] pass parameters into embed i.e. ?name, ?email etc.

import Embed from "@/src/components/Embed";

export default function Home() {
  return (
    <main className="w-full my-12">
      <Embed />
      <div className="flex gap-2 my-4 w-full justify-center">
        <button className="border bg-zinc-900 border-zinc-800 p-2 rounded-lg hover:bg-zinc-800 hover:border-zinc-700">
          Previous
        </button>
        <button className="border bg-zinc-900 border-zinc-800 p-2 rounded-lg hover:bg-zinc-800 hover:border-zinc-700">
          Next
        </button>
      </div>
    </main>
  );
}
