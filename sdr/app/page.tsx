// TODO:
// - [ ] force calendar layout
// - [ ] add fairness API from round robin
// - [ ] make next and prev button work
// - [ ] pass parameters into embed i.e. ?name, ?email etc.

import Embed from "@/src/components/Embed";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Home() {
  return (
    <main className="w-full mt-24 bg-[#4B2F3B]">
      {/*  <div className="pt-8 px-8 h-[850px] border-8 border-black/20">
        <iframe
          src="https://cal.com/team/cal/sales"
          className="w-full h-full rounded-lg  overflow-hidden"
        />
      </div> */}

      <Embed />
      <div className="flex mt-3 gap-2 w-full justify-center">
        <button className="border-2 text-sm border-[#ffa41c] bg-transparent py-3 px-5 hover:bg-[#ffa41c] hover:text-black">
          Previous
        </button>
        <button className="bg-gradient-to-r text-sm from-[#ffa41c] to-[#ffcc1c] text-black  py-3 px-5 font-medium ">
          Next
        </button>
      </div>
    </main>
  );
}
