import ImmortalityGame from "./logic";
import Sidebar from "../know-me/components/sidebar";

export default function ImmortalityGamePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <section className="flex-1 flex justify-center items-start p-6 md:p-8">
          <ImmortalityGame />
        </section>
      </div>
    </main>
  );
}