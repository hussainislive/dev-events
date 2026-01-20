import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

/**
 * GET /api/events/[slug]
 * Fetch a single event by its slug
 */
export async function GET(
    _req: NextRequest,
    context: { params: { slug?: string } }
) {
    try {
        // 1️⃣ Validate slug param
        const { slug } = await context.params;

        if (!slug || typeof slug !== "string") {
            return NextResponse.json(
                { message: "Event slug is required and must be a string" },
                { status: 400 }
            );
        }

        // 2️⃣ Connect to database
        await connectDB();

        // 3️⃣ Query event by slug
        const event = await Event.findOne({ slug }).lean();

        // 4️⃣ Handle not found
        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        // 5️⃣ Success response
        return NextResponse.json(
            {
                message: "Event fetched successfully",
                event,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/events/[slug] error:", error);

        // 6️⃣ Fallback server error
        return NextResponse.json(
            {
                message: "Failed to fetch event",
            },
            { status: 500 }
        );
    }
}
