import React from "react";
import Image from "next/legacy/image";

export default function Page() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center">
      <div className="relative h-60 sm:h-80 w-full flex items-center justify-center">
        <Image
          src="/header.png"
          layout="fill"
          objectFit="cover"
          alt="Header image"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center mt-10 flex-col">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-warm-brown">
            Study title
          </h1>
        </div>
      </div>

      <main className="flex-1  flex-col items-center justify-center p-2 bg-soft-beige">
        <section className="bg-cream rounded-lg text-center max-w-3xl mx-auto p-4">
          <h2 className="text-xl font-semibold text-warm-brown">
            About this study
          </h2>
          <p className="text-md text-warm-gray italic">
            Information about the study
          </p>
        </section>
      </main>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs italic">
        Footer info
      </footer>
    </div>
  );
}
