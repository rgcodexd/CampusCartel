import { redirect } from "next/navigation";

type ListingsPageProps = {
  searchParams?: Promise<{ mode?: "rent" | "buy" }>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const mode = params?.mode;
  redirect(mode ? `/browse?type=${mode}` : "/browse");
}
