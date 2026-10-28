'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#EFEADF] hairline-t py-12 px-6 mt-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-editorial italic text-base text-[#2B2A27]">
            &quot;The ghosts are not other people. They are your past selves.&quot;
          </p>
          <span className="font-mono-code text-[10px] tracking-[0.2em] text-[#6F6B62] uppercase">
            Pale Hours &mdash; Built for &lsquo;Ghost in the Machine&rsquo;
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-mono-code text-xs tracking-wider text-[#6F6B62]">
          <Link href="/vigil" className="hover:text-[#2B2A27] transition-colors duration-200 interactive">
            THE VIGIL
          </Link>
          <span className="text-[#CFC8B8]">&middot;</span>
          <Link href="/ofrenda" className="hover:text-[#2B2A27] transition-colors duration-200 interactive">
            THE OFRENDA
          </Link>
          <span className="text-[#CFC8B8]">&middot;</span>
          <Link href="/open" className="hover:text-[#2B2A27] transition-colors duration-200 interactive">
            HOW IT HAUNTS
          </Link>
          <span className="text-[#CFC8b8]">&middot;</span>
          <span className="text-[#D9822B]">0 BYTES LEAVE THIS MACHINE</span>
        </div>
      </div>
    </footer>
  );
}
