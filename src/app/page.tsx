import { imageSchema } from "schemas/cms";
import { queryCMS } from "utils/queryCMS";
import { z } from "zod";

export const articleSchema = z.object({
  docs: z.array(
    z.object({
      title: z.string(),
      thumbnail: imageSchema,
      tags: z.array(z.object({ tag: z.string() })),
      description: z.string(),
    }),
  ),
});

const fetchArticles = async () => {
  const articles = await queryCMS({
    depth: 1,
    endpoint: "/articles",
    limit: 10,
    schema: articleSchema,
  });
  return articles;
};

export default async function HomePage() {
  const articles = await fetchArticles();
  return (
    <main>
      <pre>{JSON.stringify(articles, null, 2)}</pre>
    </main>
  );
}
