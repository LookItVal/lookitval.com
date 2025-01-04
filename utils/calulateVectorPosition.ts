export default function (startX: number, startY: number, phase: number, magnitude: number): { x: number; y: number; } {
    const x = startX + Math.cos(phase * (Math.PI / 180)) * magnitude;
    const y = startY + Math.sin(phase * (Math.PI / 180)) * magnitude;
    return { x, y };
}
    