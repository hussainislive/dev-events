import { Suspense } from 'react';
import EventBook from '@/app/components/EventBook';
import EventCard from '@/app/components/EventCard';
import { IEvent } from '@/database/event.model';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import { cacheLife } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev-events-ten-eta.vercel.app';

/* ---------- presentation helpers ---------- */
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map(tag => (
      <div key={tag} className="pill">
        {tag}
      </div>
    ))}
  </div>
);

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

/* ---------- the component that actually needs the slug ---------- */
async function EventDetailsContent({ params }: { params: Promise<{ slug: string }> }) {
  'use cache';
  cacheLife('hours');

  const { slug } = await params; // <-- dynamic data used INSIDE suspense

  let event;
  try {
    const res = await fetch(`${BASE_URL}/api/events/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    event = data.event;
  } catch {
    return notFound();
  }
  if (!event) return notFound();

  const {
    description,
    title,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
    _id,
  } = event;

  const bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
            <EventBook eventId={_id.toString()} slug={slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((e: IEvent) => <EventCard key={e.title} {...e} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- page shell – nothing dynamic here ---------- */
export default function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div>Loading event…</div>}>
      <EventDetailsContent params={params} />
    </Suspense>
  );
}