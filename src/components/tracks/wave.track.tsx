'use client'

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWavesurfer } from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './wave.scss';
import { Tooltip } from "@mui/material";

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
};

const WaveTrack = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState("00:00");
    const [duration, setDuration] = useState("00:00");

    const waveRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);

    const params = useSearchParams();
    const audio = params.get("audio");

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
        let waveColor: string | CanvasGradient = "#656666";
        let progressColor: string | CanvasGradient = "#f97316";

        if (typeof window !== "undefined") {
            const canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = 120; // QUAN TRỌNG: phải set height để gradient hợp lệ
            const ctx = canvas.getContext("2d");

            if (ctx) {
                const g1 = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
                g1.addColorStop(0, '#656666');
                g1.addColorStop(0.7, '#656666');
                g1.addColorStop(0.71, '#ffffff');
                g1.addColorStop(0.72, '#ffffff');
                g1.addColorStop(0.73, '#B1B1B1');
                g1.addColorStop(1, '#B1B1B1');
                waveColor = g1;

                const g2 = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
                g2.addColorStop(0, '#EE772F');
                g2.addColorStop(0.7, '#EB4926');
                g2.addColorStop(0.71, '#ffffff');
                g2.addColorStop(0.72, '#ffffff');
                g2.addColorStop(0.73, '#F6B094');
                g2.addColorStop(1, '#F6B094');
                progressColor = g2;
            }
        }

        return {
            waveColor,
            progressColor,
            barWidth: 3,
            barGap: 2,
            height: 100,
            normalize: true,
            url: audio ? `/api?audio=${encodeURIComponent(audio)}` : undefined,
        };
    }, [audio]);

    const wavesurfer = useWavesurfer(waveRef, optionsMemo);

    const onPlayClick = useCallback(() => {
        if (!wavesurfer) return;
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }, [wavesurfer]);

    useEffect(() => {
        if (!wavesurfer || !waveRef.current || !hoverRef.current) return;

        setIsPlaying(false);

        const hover = hoverRef.current;
        const waveform = waveRef.current;

        const onPointerMove = (e: PointerEvent) => {
            hover.style.width = `${e.offsetX}px`;
            hover.style.opacity = "1";
        };

        const onPointerLeave = () => {
            hover.style.width = "0px";
            hover.style.opacity = "0";
        };

        waveform.addEventListener("pointermove", onPointerMove);
        waveform.addEventListener("pointerleave", onPointerLeave);

        waveform.addEventListener("pointermove", onPointerMove);

        const unsubPlay = wavesurfer.on("play", () => setIsPlaying(true));
        const unsubPause = wavesurfer.on("pause", () => setIsPlaying(false));
        const unsubDecode = wavesurfer.on("decode", (d) => setDuration(formatTime(d)));
        const unsubTime = wavesurfer.on("timeupdate", (t) => setTime(formatTime(t)));
        const unsubReady = wavesurfer.on("ready", () => {
            // ready ok
            // console.log("wavesurfer ready");
        });
        // const unsubError = wavesurfer.on("error", (err) => {
        //   console.error("WaveSurfer error:", err);
        // });

        return () => {
            waveform.removeEventListener("pointermove", onPointerMove);
            waveform.removeEventListener("pointermove", onPointerMove);
            waveform.removeEventListener("pointerleave", onPointerLeave);
            unsubPlay();
            unsubPause();
            unsubDecode();
            unsubTime();
            unsubReady();

            //   unsubError();
        };
    }, [wavesurfer]);
    const arrComments = [
        {
            id: 1,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 10,
            user: "username 1",
            content: "just a comment1"
        },
        {
            id: 2,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 30,
            user: "username 2",
            content: "just a comment3"
        },
        {
            id: 3,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 50,
            user: "username 3",
            content: "just a comment3"
        },
    ]
    const calLeft = (moment: number) => {
        let hardcodeDuration = 199;
        return `${(moment / hardcodeDuration) * 100}%`
    }
    return (
        <div className="track-box" style={{ display: "flex", justifyItems: "center" }}>
            <div className="track-left">
                <div className="track-header">
                    <button className="play-btn" onClick={onPlayClick}>
                        {isPlaying ? <PauseIcon sx={{ color: "#fff" }} /> : <PlayArrowIcon sx={{ color: "#fff" }} />}
                    </button>

                    <div className="meta" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="song-title">Hỏi Dân IT's song</div>
                        <div className="artist">Eric</div>
                    </div>
                </div>

                <div className="wave-wrap">
                    <div ref={waveRef} className="wave-form-container">
                        <div className="time">{time}</div>
                        <div className="duration">{duration}</div>
                        <div className="hover-wave" ref={hoverRef}></div>
                        <div className="comments" style={{ position: "relative" }}>
                            {
                                arrComments.map(c => {
                                    return (
                                        <Tooltip key={c.id} title={`${c.user}: ${c.content}`} placement="top" arrow>
                                            <img
                                                onPointerMove={(e) => {
                                                    const hover = hoverRef.current!;
                                                    hover.style.width = calLeft(c.moment + 3)
                                                    // hover.style.opacity = "1";
                                                }}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    position: "absolute",
                                                    top: 80,
                                                    zIndex: 20,
                                                    left: calLeft(c.moment)
                                                }}
                                                key={c.id}
                                                src="http://localhost:8000/images/chill1.png"
                                            />
                                        </Tooltip>);
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>

            <div className="track-right" />
        </div>
    );
};

export default WaveTrack;