/**
 * Minimalist aisle perspective background — simple gray strokes
 * that suggest warehouse shelves converging to a vanishing point.
 * Fully responsive via viewBox + preserveAspectRatio.
 */
export default function AislePerspective() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1000 1400"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vanishing point at (500, 180) */}
        {/* Left shelves — vertical uprights converging */}
        {[60, 140, 220, 300].map((x, i) => (
          <line
            key={`lv-${i}`}
            x1={x}
            y1={1400}
            x2={500 - (500 - x) * 0.12}
            y2={180}
            stroke="currentColor"
            className="text-foreground/[0.06]"
            strokeWidth={1.2}
          />
        ))}

        {/* Right shelves — vertical uprights converging */}
        {[940, 860, 780, 700].map((x, i) => (
          <line
            key={`rv-${i}`}
            x1={x}
            y1={1400}
            x2={500 + (x - 500) * 0.12}
            y2={180}
            stroke="currentColor"
            className="text-foreground/[0.06]"
            strokeWidth={1.2}
          />
        ))}

        {/* Left shelf horizontals (perspective lines converging) */}
        {[400, 550, 720, 920, 1150].map((y, i) => {
          const t = (y - 180) / (1400 - 180);
          const leftEdge = 60 + (500 - 60) * (1 - t) * 0.12;
          const innerEdge = 300 + (500 - 300) * (1 - t) * 0.12;
          return (
            <line
              key={`lh-${i}`}
              x1={leftEdge - (500 - leftEdge) * t * 0.6}
              y1={y}
              x2={innerEdge + (500 - innerEdge) * (1 - t) * 0.15}
              y2={y}
              stroke="currentColor"
              className="text-foreground/[0.05]"
              strokeWidth={0.8}
            />
          );
        })}

        {/* Right shelf horizontals */}
        {[400, 550, 720, 920, 1150].map((y, i) => {
          const t = (y - 180) / (1400 - 180);
          const rightEdge = 940 - (940 - 500) * (1 - t) * 0.12;
          const innerEdge = 700 - (700 - 500) * (1 - t) * 0.12;
          return (
            <line
              key={`rh-${i}`}
              x1={innerEdge - (innerEdge - 500) * (1 - t) * 0.15}
              y1={y}
              x2={rightEdge + (rightEdge - 500) * t * 0.6}
              y2={y}
              stroke="currentColor"
              className="text-foreground/[0.05]"
              strokeWidth={0.8}
            />
          );
        })}

        {/* Floor perspective lines — subtle ground plane */}
        {[380, 440].map((x, i) => (
          <line
            key={`fl-${i}`}
            x1={x}
            y1={1400}
            x2={500}
            y2={180}
            stroke="currentColor"
            className="text-foreground/[0.03]"
            strokeWidth={0.6}
            strokeDasharray="8 16"
          />
        ))}
        {[620, 560].map((x, i) => (
          <line
            key={`fr-${i}`}
            x1={x}
            y1={1400}
            x2={500}
            y2={180}
            stroke="currentColor"
            className="text-foreground/[0.03]"
            strokeWidth={0.6}
            strokeDasharray="8 16"
          />
        ))}
      </svg>
    </div>
  );
}
