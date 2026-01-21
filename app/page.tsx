import { cacheLife } from "next/cache";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import { GET } from "./api/events/route"; // ← import the handler

export default async function Page() {
  'use cache';
  cacheLife('hours');

  /* 1.  call the handler directly (no fetch, no port) */
  const response = await GET();               // ← same as HTTP call, but local
  if (!response.ok) return [];
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events?.map((event: IEvent) => (
            <li className="list-none" key={String(event._id)}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}