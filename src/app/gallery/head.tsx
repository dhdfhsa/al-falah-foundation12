import { SITE_NAME, siteUrl } from "@/lib/site";

export default function Head() {
  const title = `Gallery | ${SITE_NAME}`;
  const description =
    "Browse photos and highlights from Al Falah Foundation's relief, education, and healthcare work across Bangladesh.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <link rel="canonical" href={siteUrl("/gallery")} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl("/gallery")} />
      <meta property="og:image" content={siteUrl("/opengraph-image")} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={siteUrl("/twitter-image")} />
    </>
  );
}
