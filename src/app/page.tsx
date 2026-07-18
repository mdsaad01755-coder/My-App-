import Hero, { ScrollPlaceholder } from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <ScrollPlaceholder />
    </main>
  );
}
