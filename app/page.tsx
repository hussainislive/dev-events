import { cacheLife } from "next/cache";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import { IEvent } from "@/database/event.model";

const page = async () => {
  'use cache';
  cacheLife('hours');

  /* ----  internal fetch  ---- */
  const res = await fetch(new URL('/api/events', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'), {
    next: { revalidate: 60 }
  });

  if (!res.ok) return [];
  const { events } = await res.json();

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conderences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li className="list-none" key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;