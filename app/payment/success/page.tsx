import { redirect } from 'next/navigation';

export default async function PaymentSuccessRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orderId = params.order || params.orderId || params.refId || '';

  redirect(`/checkout/success?orderId=${encodeURIComponent(String(orderId))}`);
}
