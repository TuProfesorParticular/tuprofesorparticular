import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0 Chrome" } },
  ).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  const url = match?.[1];
  if (!url) throw new Error("No se pudo resolver la fuente");
  return fetch(url).then((res) => res.arrayBuffer());
}

function mark(markSize: number) {
  return (
    <div style={{ position: "relative", width: markSize, height: markSize, display: "flex" }}>
      <div
        style={{
          position: "absolute",
          left: markSize * 0.22,
          top: markSize * 0.03,
          width: markSize * 0.56,
          height: markSize * 0.56,
          borderRadius: "50%",
          background: "#0d9488",
          opacity: 0.9,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: markSize * 0.06,
          top: markSize * 0.31,
          width: markSize * 0.56,
          height: markSize * 0.56,
          borderRadius: "50%",
          background: "#ea580c",
          opacity: 0.9,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: markSize * 0.38,
          top: markSize * 0.31,
          width: markSize * 0.56,
          height: markSize * 0.56,
          borderRadius: "50%",
          background: "#7c3aed",
          opacity: 0.9,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}

export default async function OpengraphImage() {
  const [regular, extrabold] = await Promise.all([loadFont(500), loadFont(800)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ccfbf1 0%, #fed7aa 55%, #ede9fe 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {mark(150)}
          <div
            style={{
              display: "flex",
              fontFamily: "Jakarta",
              fontWeight: 800,
              fontSize: 68,
              color: "#1c1917",
            }}
          >
            Tu<span style={{ color: "#0d9488" }}>Profesor</span>Particular
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "Jakarta",
            fontWeight: 500,
            fontSize: 34,
            color: "#44403c",
          }}
        >
          Encuentra tu profesor, entrenador o profesional ideal
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: regular, weight: 500, style: "normal" },
        { name: "Jakarta", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
