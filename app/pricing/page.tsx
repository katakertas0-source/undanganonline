import { redirect } from 'next/navigation';

/**
 * Pricing page has been removed per business requirement.
 * All traffic is seamlessly redirected to /templates.
 */
export default function PricingPage() {
  redirect('/templates');
}
