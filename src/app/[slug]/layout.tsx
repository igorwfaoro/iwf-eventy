import { ReactNode, cache } from 'react';
import { createEventService } from '../../app-services/event.service';
import { EventNavbar } from './components/Navbar';
import { EventFooter } from './components/Footer';
import { Metadata } from 'next';

interface LayoutProps {
  params: { slug: string };
  children: ReactNode;
}

const getEvent = cache(async (slug: string) => {
  return await createEventService().getBySlug(slug);
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEvent(params.slug);

  return {
    description: event.titleDescription,
    robots: 'index',
    themeColor: event.content?.primaryColor,
    openGraph: {
      description: event.titleDescription,
      ...(event.content?.logoImage && { images: event.content.logoImage }),
      type: 'website',
      siteName: `Eventy`,
    },
    twitter: {
      title: event.titleDescription,
      description: `${event.titleDescription} | Eventy`,
      card: 'summary',
      ...(event.content?.logoImage && { images: event.content.logoImage }),
    },
  };
}

export default async function EventLayout({ params, children }: LayoutProps) {
  const event = await getEvent(params.slug);

  return (
    <>
      <EventNavbar event={event} />
      {children}
      <EventFooter />
    </>
  );
}
