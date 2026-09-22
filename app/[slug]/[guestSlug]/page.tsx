import { Metadata } from 'next';
import { getInvitationMetaInfo, getInvitationDataForServer, getSiteOrigin } from '@/lib/supabase/metadata';
import { PersonalizedGuestClient } from '@/components/engine/PersonalizedGuestClient';

interface PageProps {
  params: Promise<{ slug: string; guestSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, guestSlug } = await params;
  const meta = await getInvitationMetaInfo(slug, guestSlug);
  const origin = getSiteOrigin();
  const canonicalUrl = `${origin}/${slug}${guestSlug ? `/${guestSlug}` : ''}`;
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

export default async function PersonalizedGuestInvitationPage({ params }: PageProps) {
  const { slug, guestSlug } = await params;
  const [initialInvitation, meta] = await Promise.all([
    getInvitationDataForServer(slug),
    getInvitationMetaInfo(slug, guestSlug),
  ]);
  return (
    <PersonalizedGuestClient
      slug={slug}
      guestSlug={guestSlug}
      initialInvitation={initialInvitation}
      initialGuestName={meta.guestName}
    />
  );
}
