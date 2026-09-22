import { Metadata } from 'next';
import { getInvitationMetaInfo, getInvitationDataForServer } from '@/lib/supabase/metadata';
import { PublicInvitationClient } from '@/components/engine/PublicInvitationClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getInvitationMetaInfo(slug);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: meta.ogImageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.ogImageUrl],
    },
  };
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const initialInvitation = await getInvitationDataForServer(slug);
  return <PublicInvitationClient slug={slug} initialInvitation={initialInvitation} />;
}
