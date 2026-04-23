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
  const tool = toolsConfig.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  // Create JSON-LD FAQ Schema
  const faqSchema = tool.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // SoftwareApplication Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": tool.seoDescription,
    "applicationCategory": tool.type === 'calculator' ? 'CalculatorApplication' : 'BusinessApplication',
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <ToolClient slug={slug} faqs={tool.faqs} />
    </>
  );
}

export async function generateStaticParams() {
  return toolsConfig.map((tool) => ({
    slug: tool.slug,
  }));
}
