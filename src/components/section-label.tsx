interface iAppProps {
  text: string;
}
const SectionLabel = ({ text }: iAppProps) => {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-700/50 bg-linear-to-br from-zinc-800 via-zinc-900 to-black px-3 py-1 text-[11px] font-black tracking-[0.2em] text-zinc-400 shadow-2xl backdrop-blur-md">
      <span className="relative flex h-2 w-2 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      {text}
    </span>
  );
};

export default SectionLabel;
