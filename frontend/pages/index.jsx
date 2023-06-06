import { ConnectButton } from "@rainbow-me/rainbowkit";
export default function Home() {
  return (
    <>
      <div className="h-screen w-full bg-gradient-to-r from-sky-500 to-indigo-500 ">
        <nav className="p-4 border-black flex justify-end fixed w-full">
          <ConnectButton></ConnectButton>
        </nav>
        <main className="h-full flex items-center justify-center">
          <h1 className="font-mono text-5xl">Cool UI Here</h1>
        </main>
      </div>
    </>
  );
}
