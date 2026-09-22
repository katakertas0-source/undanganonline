import { Metadata } from 'next';
import { getInvitationMetaInfo, getInvitationDataForServer } from '@/lib/supabase/metadata';
import { PersonalizedGuestClient } from '@/components/engine/PersonalizedGuestClient';

interface PageProps {
  params: Promise<{ slug: string; guestSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, guestSlug } = await params;
  const meta = await getInvitationMetaInfo(slug, guestSlug);

  const imagesList = [];
  if (meta.coverImageUrl) {
    imagesList.push({
      url: meta.coverImageUrl,
      width: 1200,
      height: 630,
      alt: `${meta.groomNickname} & ${meta.brideNickname}`,
    });
  }
  if (meta.ogImageUrl && meta.ogImageUrl !== meta.coverImageUrl) {
    imagesList.push({
      url: meta.ogImageUrl,
      width: 1200,
      height: 630,
      alt: meta.title,
    });
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: 'Kertas.Kata — Undangan Online',
      type: 'article',
      images: imagesList,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.coverImageUrl || meta.ogImageUrl],
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
