import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 1,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#0d9488",
            opacity: 0.9,
            mixBlendMode: "multiply",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 1.8,
            top: 10,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#ea580c",
            opacity: 0.9,
            mixBlendMode: "multiply",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 12.2,
            top: 10,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#7c3aed",
            opacity: 0.9,
            mixBlendMode: "multiply",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
