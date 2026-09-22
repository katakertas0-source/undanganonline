import { Metadata } from 'next';
import { getInvitationMetaInfo, getInvitationDataForServer, getSiteOrigin } from '@/lib/supabase/metadata';
import { PublicInvitationClient } from '@/components/engine/PublicInvitationClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getInvitationMetaInfo(slug);
  const origin = getSiteOrigin();
  const canonicalUrl = `${origin}/${slug}`;
  const coverJpgUrl = `${origin}/api/cover/${slug}.jpg`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      siteName: 'Kertas.Kata — Undangan Online',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: coverJpgUrl,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: `${meta.groomNickname} & ${meta.brideNickname}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [coverJpgUrl],
    },
  };
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const [initialInvitation, meta] = await Promise.all([
    getInvitationDataForServer(slug),
    getInvitationMetaInfo(slug),
  ]);
  return (
    <PublicInvitationClient
      slug={slug}
      initialInvitation={initialInvitation}
      guestName={meta.guestName}
    />
  );
}
