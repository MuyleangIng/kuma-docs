type StatusBody = {
  md5?: string;
  pollToken?: string;
};

const API_BASE_URL = "https://koma.khqr.site";

function requireString(value: unknown, name: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} is required.`);
  }

  return value.trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StatusBody;
    const md5 = requireString(body.md5, "md5");
    const pollToken = requireString(body.pollToken, "pollToken");

    const upstream = await fetch(`${API_BASE_URL}/api/payment/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ md5, pollToken }),
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json; charset=utf-8";
    const bodyText = await upstream.text();

    return new Response(bodyText, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Status test failed.",
      },
      { status: 400 },
    );
  }
}
