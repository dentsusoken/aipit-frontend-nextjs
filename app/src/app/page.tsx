import { PrismaClient, User }  from "@prisma/client";

// const prisma = new PrismaClient();


export default async function Home() {
  // const users: User[] = await prisma.user.findMany();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
        <p className="text-2xl">This is a simple example of a Next.js app with Prisma.</p>
        {/* Users:{users.length} */}
        {/* <ul>
          {users.map((user: User) => (
            <li key={user.id} className="flex gap-2">
              <span>{user.name}</span>
              <span>{user.email}</span>
            </li>
          ))}
        </ul> */}
      </main>
      <footer className="flex flex-col gap-2 row-start-3 items-center">
        <p className="text-sm text-gray-500">Powered by Next.js</p>
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          Documentation
        </a>
        </footer>
    </div>
  );
}
