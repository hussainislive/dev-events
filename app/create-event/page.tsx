"use client";                       // ← must be client because we use file input & FormData

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateEventPage() {
    const router = useRouter();

    /* ---------- form state ---------- */
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [overview, setOverview] = useState("");
    const [venue, setVenue] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [mode, setMode] = useState("offline");
    const [audience, setAudience] = useState("");
    const [organizer, setOrganizer] = useState("");
    const [tags, setTags] = useState<string[]>([""]);          // dynamic list
    const [agenda, setAgenda] = useState<string[]>([""]);      // dynamic list
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------- helpers ---------- */
    const addTag = () => setTags([...tags, ""]);
    const addAgenda = () => setAgenda([...agenda, ""]);
    const updateTag = (i: number, val: string) => {
        const copy = [...tags];
        copy[i] = val;
        setTags(copy);
    };
    const updateAgenda = (i: number, val: string) => {
        const copy = [...agenda];
        copy[i] = val;
        setAgenda(copy);
    };

    /* ---------- submit ---------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) { alert("Please select an image"); return; }
        setLoading(true); setError("");

        const form = new FormData();
        form.append("title", title);
        form.append("description", description);
        form.append("overview", overview);
        form.append("venue", venue);
        form.append("location", location);
        form.append("date", date);
        form.append("time", time);
        form.append("mode", mode);
        form.append("audience", audience);
        form.append("organizer", organizer);
        form.append("tags", JSON.stringify(tags.filter(Boolean)));
        form.append("agenda", JSON.stringify(agenda.filter(Boolean)));
        form.append("image", image);

        try {
            const res = await fetch("/api/events", { method: "POST", body: form });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Creation failed");
            router.push(`/events/${data.event.slug}`);   // redirect to new event
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-6xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <div className="bg-[#0D161A] w-[40vw] rounded-lg p-4">
                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-[100%]">
                    {/* ----- text inputs ----- */}
                    <input className="input bg-[#182830] rounded px-2 text-sm py-2" placeholder="Enter Event Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea className="input bg-[#182830] rounded px-2 text-sm py-2" placeholder="Short description" required value={description} onChange={(e) => setDescription(e.target.value)} />
                    <textarea className="input bg-[#182830] rounded px-2 text-sm py-2" placeholder="Full overview" required value={overview} onChange={(e) => setOverview(e.target.value)} />
                    <input className="input bg-[#182830] rounded px-2 text-sm py-2" placeholder="Venue name" required value={venue} onChange={(e) => setVenue(e.target.value)} />
                    <input className="input bg-[#182830] rounded px-2 text-sm py-2" placeholder="City, Country" required value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input className=" bg-[#182830] rounded px-2 text-sm py-2" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
                    <input className="input bg-[#182830] rounded px-2 text-sm py-2" type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
                    <select className="input bg-[#182830] rounded px-2 text-sm py-2" value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                    <input className="input bg-[#182830] rounded px-2 text-sm py-2" placeholder="Target audience" required value={audience} onChange={(e) => setAudience(e.target.value)} />
                    <textarea className="input bg-[#182830] rounded px-2 text-sm py-2" placeholder="Organizer details" required value={organizer} onChange={(e) => setOrganizer(e.target.value)} />

                    {/* ----- dynamic tags ----- */}
                    <div>
                        <label className="block mb-2 font-semibold bg-[#182830] rounded px-2 text-sm py-2">Tags</label>
                        {tags.map((t, i) => (
                            <div key={i} className="flex gap-2 mb-2 bg-[#182830] rounded px-2 text-sm py-2">
                                <input className="input flex-1 bg-[#182830] rounded px-2 text-sm py-2" placeholder="Tag" value={t} onChange={(e) => updateTag(i, e.target.value)} />
                            </div>
                        ))}
                        <button type="button" className="btn-secondary bg-[#182830] rounded px-2 text-sm py-2" onClick={addTag}>+ Add Tag</button>
                    </div>

                    {/* ----- dynamic agenda ----- */}
                    <div>
                        <label className="block mb-2 font-semibold bg-[#182830] rounded px-2 text-sm py-2">Agenda</label>
                        {agenda.map((a, i) => (
                            <div key={i} className="flex gap-2 mb-2 bg-[#182830] rounded px-2 text-sm py-2">
                                <input className="input flex-1 bg-[#182830] rounded px-2 text-sm py-2" placeholder="Agenda item" value={a} onChange={(e) => updateAgenda(i, e.target.value)} />
                            </div>
                        ))}
                        <button type="button" className="btn-secondary bg-[#182830] rounded px-2 text-sm py-2" onClick={addAgenda}>+ Add Item</button>
                    </div>

                    {/* ----- image ----- */}
                    <div>
                        <label className="block mb-2 font-semibold bg-[#182830] rounded px-2 text-sm py-2">Event Image</label>
                        <input type="file" accept="image/*" required onChange={(e) => setImage(e.target.files?.[0] || null)} />
                    </div>

                    {/* ----- errors / submit ----- */}
                    {error && <p className="text-red-600">{error}</p>}
                    <button type="submit" className="btn-primary w-full bg-[#182830] rounded px-2 text-sm py-2" disabled={loading}>
                        {loading ? "Creating..." : "Create Event"}
                    </button>
                </form>
            </div>

        </section>
    );
}