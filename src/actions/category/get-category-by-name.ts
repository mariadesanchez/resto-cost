// actions.ts
import prisma from "@/lib/prisma";

export const getCategoryByName = async (name: string): Promise<string> => {
  const category = await prisma.category.findUnique({
    where: { name },
  });
  if (!category) {
    throw new Error(`Category with name ${name} not found`);
  }
  return category.id;
};
