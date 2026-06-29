import { NextResponse } from "next/server";
import { completeFreelancerProject, getFreelancerActiveProjects } from "@/lib/dashboard-freelancer-active-projects";

export async function GET(request) {
  try {
    const userEmail = request.headers.get("x-user-email")?.trim() || "";
    const userRole = request.headers.get("x-user-role")?.trim().toLowerCase() || "";

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity" }, { status: 401 });
    }

    if (userRole && userRole !== "freelancer") {
      return NextResponse.json({ success: false, message: "Only freelancers can access active projects" }, { status: 403 });
    }

    const data = await getFreelancerActiveProjects(userEmail);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to load active projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userEmail = request.headers.get("x-user-email")?.trim() || "";
    const userRole = request.headers.get("x-user-role")?.trim().toLowerCase() || "";

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity" }, { status: 401 });
    }

    if (userRole && userRole !== "freelancer") {
      return NextResponse.json({ success: false, message: "Only freelancers can submit deliverables" }, { status: 403 });
    }

    const result = await completeFreelancerProject({
      taskId: body?.taskId,
      deliverableUrl: body?.deliverableUrl,
      freelancerEmail: userEmail,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to submit deliverable" }, { status: 400 });
  }
}
