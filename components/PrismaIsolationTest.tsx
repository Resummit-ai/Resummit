"use client";

// This import SHOULD make the build/dev fail because it points to a server-only module
// import { prisma } from "@/lib/server/prisma";

export function PrismaIsolationTest() {
  return (
    <div className="p-4 border border-red-500 rounded bg-red-500/10">
      <h3 className="font-bold text-red-500">Prisma Isolation Test</h3>
      <p className="text-sm text-neutral-400">
        If you uncomment the internal import, this component should cause a build error.
      </p>
    </div>
  );
}
