import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PageMetadataParams {
  locale: string;
  namespace?: string;
  dynamicParams?: Record<string, string>;
}

export async function generatePageMetadata({
  locale,
  namespace = "metadata",
  dynamicParams,
}: PageMetadataParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  const title = dynamicParams?.title || t("title");
  const description = dynamicParams?.description || t("description");
  const keywords = dynamicParams?.keywords || t("keywords");

  const baseMetadata = {
    title,
    description,
    keywords,
    authors: [{ name: "Be-ntc" }],
    creator: "Be-ntc",
    publisher: "Be-ntc",
  };

  return createMetadata(baseMetadata, locale);
}

export function createMetadata(override: Metadata, locale: string): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://be-ntc.cd";
  const ogImageUrl = `${baseUrl}/og-image.png`;

  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl,
      images: ogImageUrl,
      siteName: "Be-ntc",
      locale,
      type: "website",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@be_ntc",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: ogImageUrl,
      ...override.twitter,
    },
  };
}
