const FALL_OFF = 1 / 6;
const TICK_WIDTH = 2;

export default function TickMarkSvg({
  min,
  max,
  current,
  deadzone,
  distanceBetweenMarkers
}) {
  // Ensuring the deadzone is symmetrical (odd)
  if (deadzone % 2 === 0) {
    deadzone += 1;
  }
  const tickmarks = [];
  for (let i = min; i <= max; i++) {
    const distanceToCenter = Math.abs(i - current);
    const outerOpacityDropoff = Math.round(
      Math.min(((1 / Math.abs(current - i)) * 100) / FALL_OFF, 100)
    );
    const innerOpacityDropoff = Math.round(
      Math.min(Math.round(distanceToCenter / deadzone) * 100, 100)
    );
    tickmarks.push(
      <TickMark
        key={i}
        xPos={i}
        opacity={Math.min(outerOpacityDropoff, innerOpacityDropoff)}
        offset={-min}
        current={current}
        large={i % 5 === 0}
        distanceBetweenMarkers={distanceBetweenMarkers}
      />
    );
  }

  return (
    <svg
      width={(max - min) * distanceBetweenMarkers + TICK_WIDTH}
      height="26"
      viewBox={`0 0 ${(max - min) * distanceBetweenMarkers + TICK_WIDTH} 20`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {tickmarks}
    </svg>
  );
}

function TickMark({
  xPos,
  opacity,
  distanceBetweenMarkers,
  offset,
  large = false
}) {
  return (
    <rect
      t={xPos}
      x={(xPos + offset) * distanceBetweenMarkers}
      width={TICK_WIDTH}
      y={large ? '5' : '8'}
      height={large ? '8' : '2'}
      fill="currentColor"
      opacity={`${opacity}%`}
    />
  );
}
