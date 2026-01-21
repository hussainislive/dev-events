import { cacheLife } from "next/cache";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import { IEvent } from "@/database/event.model";

export default async function Page() {
  'use cache';
  cacheLife('hours');

  /* 1.  guaranteed internal URL – works both in build & runtime */
  const base =
    process.env.NODE_ENV === 'production'
      ? `http://localhost:3000`          // ← build-time localhost inside serverless
      : `http://localhost:3000`;

  const res = await fetch(`${base}/api/events`, { next: { revalidate: 60 } });

  /* 2.  fallback only when DB is really empty */
  if (!res.ok) return [];
  const { events } = await res.json();

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events?.map((event: IEvent) => (
            <li className="list-none" key={event._id}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}