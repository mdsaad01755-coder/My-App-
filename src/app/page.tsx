import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Features />
      <About />
    </main>
  );
}
