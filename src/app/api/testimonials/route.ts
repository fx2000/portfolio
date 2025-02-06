import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { ITestimonial } from "@/types/types";

export async function GET() {
  try {
    // Get the path to the mock JSON file
    const jsonFilePath = path.join(
      process.cwd(),
      "src",
      "app",
      "api",
      "testimonials",
      "data.json"
    );

    // Read the JSON file
    const fileContents = await fs.readFile(jsonFilePath, "utf-8");
    const mockData = JSON.parse(fileContents) as ITestimonial[];

    // Return the JSON response
    return new NextResponse(JSON.stringify(mockData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error reading testimonials:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch testimonials" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
