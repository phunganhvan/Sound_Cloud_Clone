import { useState, useEffect } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import WaveSurfer from "wavesurfer.js";

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};
export const useWavesurfer = (
  containerRef: React.RefObject<HTMLDivElement>,
  options: Omit<WaveSurferOptions, 'container'>
) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
      renderFunction: (channels, ctx) => {
        const { width, height } = ctx.canvas;

        const barWidth = options.barWidth || 3;
        const barGap = options.barGap || 2;
        const barRadius = options.barRadius || 2;
        const centerGap = 4;

        const progress = (options as any).progress || 0;

        const barCount = Math.floor(width / (barWidth + barGap));
        const step = Math.ceil(channels[0].length / barCount);

        const topHeight = height * 0.7;
        const bottomHeight = height * 0.3;

        const centerY = topHeight;

        const normalize = (v: number) => Math.min(1, Math.max(0, v));

        // 🔲 BACKGROUND PHẦN DƯỚI (nhạt hơn, KHÔNG bị ảnh hưởng bởi progress)
        ctx.save();
        ctx.globalAlpha = 0.1; // 🔥 giảm độ đậm
        ctx.fillStyle = "#030303";
        ctx.fillRect(0, centerY, width, bottomHeight);
        ctx.restore(); // cực quan trọng để không ảnh hưởng phần sau

        for (let i = 0; i < barCount; i++) {
          let sum = 0;

          for (let j = 0; j < step; j++) {
            const index = i * step + j;
            const val = Math.abs(channels[0][index]) || 0;
            sum += val;
          }

          const avg = sum / step;
          const value = normalize(avg * 1.5);

          const x = i * (barWidth + barGap);

          const isPlayed = i / barCount < progress;

          // 🎯 chỉ bars đổi màu
          ctx.fillStyle = isPlayed ? "#ff6a00" : "#bfbfbf";

          // 🔼 TOP (70%)
          const barHeightTop = value * (topHeight * 0.9);

          drawRoundedRect(
            ctx,
            x,
            centerY - centerGap / 2 - barHeightTop,
            barWidth,
            barHeightTop,
            barRadius
          );
          ctx.fill();

          // 🔽 BOTTOM (30%)
          const barHeightBottom = value * (bottomHeight * 0.9);

          drawRoundedRect(
            ctx,
            x,
            centerY + centerGap / 2,
            barWidth,
            barHeightBottom,
            barRadius
          );
          ctx.fill();
        }

        // ➖ line giữa
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }
    })

    setWavesurfer(ws)

    return () => {
      ws.destroy()
    }
  }, [options, containerRef])

  return wavesurfer
}