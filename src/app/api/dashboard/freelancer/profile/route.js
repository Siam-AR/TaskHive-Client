import { NextResponse } from "next/server";
import { getAuthDb } from "@/lib/server-auth-db";
import { getServerSession } from "@/lib/session";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const resolveUserIdentity = async (request) => {
  const session = await getServerSession().catch(() => null);
  const sessionEmail = session?.user?.email?.trim();
  const sessionRole = String(session?.user?.role || "").toLowerCase();

  const headerEmail = request.headers.get("x-user-email")?.trim();
  const headerRole = request.headers.get("x-user-role")?.trim()?.toLowerCase() || "";

  return {
    email: normalizeEmail(sessionEmail || headerEmail || ""),
    role: sessionRole || headerRole,
  };
};

export async function GET(request) {
  try {
    const { email: userEmail } = await resolveUserIdentity(request);

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity" }, { status: 401 });
    }

    const db = await getAuthDb();
    const usersCollection = db.collection("user");
    const user = await usersCollection.findOne({ email: normalizeEmail(userEmail) }, { projection: { password: 0 } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { email: userEmail, role: userRole } = await resolveUserIdentity(request);

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity" }, { status: 401 });
    }

    if (userRole && userRole !== "freelancer") {
      return NextResponse.json({ success: false, message: "Only freelancers can update this profile" }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const image = String(body.image || "").trim();
    const skills = Array.isArray(body.skills) ? body.skills.map((skill) => String(skill || "").trim()).filter(Boolean) : [];
    const bio = String(body.bio || "").trim();
    const hourlyRate = Number(body.hourlyRate ?? body.hourly_rate ?? body.hourlyRateUSD ?? 0);

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    if (hourlyRate < 0) {
      return NextResponse.json({ success: false, message: "Hourly rate must be a positive number" }, { status: 400 });
    }

    const db = await getAuthDb();
    const usersCollection = db.collection("user");
    const normalizedEmail = normalizeEmail(userEmail);

    const updateResult = await usersCollection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          name,
          image,
          skills,
          bio,
          hourlyRate,
          updatedAt: new Date(),
        },
      }
    );

    if (!updateResult.matchedCount) {
      return NextResponse.json({ success: false, message: "Profile update failed" }, { status: 500 });
    }

    const updatedUser = await usersCollection.findOne({ email: normalizedEmail }, { projection: { password: 0 } });
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to update profile" }, { status: 500 });
  }
}
