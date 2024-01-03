import {
  HiSolidEllipsisVertical,
  HiSolidMagnifyingGlass,
  HiSolidPlay,
} from "solid-icons/hi";
import { twMerge } from "tailwind-merge";
import { audioHandler, queue } from "./AudioHandler";

const Header = () => {
  return (
    <>
      <div class="fixed bottom-16 right-0 top-16 z-50 w-64 bg-red-100">
        <div class="flex flex-col">
          {queue().items.map((item, i) => {
            return (
              <div class="group flex items-center gap-2 border-b-2 border-black bg-red-600 px-2 py-1">
                <div class="relative">
                  <img
                    class="rounded object-cover"
                    src={`http://localhost:3000${item.coverArt}`}
                    alt=""
                    width="48"
                  />
                  <button
                    class={twMerge(
                      "absolute bottom-0 left-0 right-0 top-0 z-10 hidden w-full items-center justify-center rounded bg-black/70 group-hover:flex",
                      i === queue().index && "flex",
                    )}
                    onClick={() => {
                      audioHandler?.setQueueIndex(i);
                    }}
                  >
                    <HiSolidPlay class="text-white" size="32" />
                  </button>
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-sm">{item.name}</p>
                  <p class="text-xs text-gray-500">{item.artistName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div class="fixed left-0 right-0 top-0 z-50 h-16 border-b-2 bg-white px-4 shadow-lg">
        <div class="flex h-full items-center justify-between">
          <div class="flex h-full items-center gap-4 px-3">
            <a class="text-2xl" href="/">
              Dwebble
            </a>
          </div>
          <div class="flex gap-6">
            <button>
              <HiSolidMagnifyingGlass size="32" />
            </button>
            <div class="relative flex items-center">
              <button>
                <HiSolidEllipsisVertical size="32" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
