import { toolsConfig } from '@/data/toolsConfig';
import { notFound } from 'next/navigation';
import ToolClient from './ToolClient';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsConfig.find((t) => t.slug === slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | QuoteCatch',
    };
  }

  return {
    title: `${tool.title} | Free Roofing Tools by QuoteCatch`,
    description: tool.seoDescription,
    alternates: {
      canonical: `https://getquotecatch.com/tools/${slug}`,
    },
    openGraph: {
      title: tool.title,
      description: tool.seoDescription,
      url: `https://getquotecatch.com/tools/${slug}`,
      siteName: 'QuoteCatch',
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  return <ToolClient slug={slug} />;
}

export async function generateStaticParams() {
  return toolsConfig.map((tool) => ({
    slug: tool.slug,
  }));
}
