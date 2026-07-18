export default function Sidebar() {
  return (
    <aside className="w-52 shrink-0 min-h-screen bg-[#0f0f0f] border-r border-yellow-500/20 flex flex-col p-5">
      <div className="space-y-8 fixed">
        <h2 className="text-yellow-400 text-lg font-bold tracking-widest">
          SYSTEM
        </h2>

        <nav className="flex flex-col gap-3">
          <a
            href="/game"
            className="px-4 py-3 rounded-lg border border-yellow-500/20
            bg-neutral-900 text-yellow-200
            hover:bg-yellow-500/10
            hover:border-yellow-400
            hover:translate-x-1
            transition-all duration-300"
          >
            Game
          </a>

          <a
            href="/know-me"
            className="px-4 py-3 rounded-lg border border-yellow-500/20
            bg-neutral-900 text-yellow-200
            hover:bg-yellow-500/10
            hover:border-yellow-400
            hover:translate-x-1
            transition-all duration-300"
          >
            Know Me
          </a>

          <a
            href="/likes"
            className="px-4 py-3 rounded-lg border border-yellow-500/20
            bg-neutral-900 text-yellow-200
            hover:bg-yellow-500/10
            hover:border-yellow-400
            hover:translate-x-1
            transition-all duration-300"
          >
            ❤️ Likes
          </a>
        </nav>
      </div>

      <div className="mt-auto pt-6 text-xs text-neutral-500">
        v0.0.1-beta
      </div>
    </aside>
  );
}