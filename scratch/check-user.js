const { prisma } = require('../lib/server/db.js');

async function main() {
  const id = "c9bdea2b-77ec-4b91-8974-2aeddf49cfad";
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    console.log("Database Lookup for ID:", id);
    console.log("Result:", user ? "FOUND" : "NOT FOUND");
    if (user) console.log(user);

    const emailUser = await prisma.user.findUnique({
      where: { email: "adelmuhammed786@gmail.com" }
    });
    console.log("\nDatabase Lookup for Email:", "adelmuhammed786@gmail.com");
    console.log("Result:", emailUser ? "FOUND" : "NOT FOUND");
    if (emailUser) console.log(emailUser);

  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

main();
