"use client";

import { useState, useCallback, useRef } from "react";

interface CameraState {
  photo: string | null;
  error: string | null;
  loading: boolean;
}

export function useCamera() {
  const [state, setState] = useState<CameraState>({
    photo: null,
    error: null,
    loading: false,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const captureFromFileInput = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      inputRef.current = input;

      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        setState((prev) => ({ ...prev, loading: true }));

        try {
          const base64 = await fileToBase64(file);
          setState({ photo: base64, error: null, loading: false });
          resolve(base64);
        } catch {
          setState({
            photo: null,
            error: "Failed to read photo",
            loading: false,
          });
          resolve(null);
        }
      };

      input.oncancel = () => {
        resolve(null);
      };

      input.click();
    });
  }, []);

  const captureFromCamera = useCallback(async (): Promise<string | null> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setState((prev) => ({
        ...prev,
        error: "Camera is not supported",
      }));
      return null;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1920, height: 1080 },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      await video.play();

      // Wait for video to have actual dimensions
      await new Promise<void>((r) => {
        if (video.videoWidth > 0) {
          r();
        } else {
          video.onloadedmetadata = () => r();
        }
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop());

      const base64 = canvas.toDataURL("image/jpeg", 0.85);
      setState({ photo: base64, error: null, loading: false });
      return base64;
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Camera permission denied"
          : "Failed to capture photo";
      setState({ photo: null, error: message, loading: false });
      return null;
    }
  }, []);

  const capture = useCallback(async (): Promise<string | null> => {
    // On mobile, prefer file input with capture attribute
    // On desktop, try getUserMedia first
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      return captureFromFileInput();
    }
    return captureFromCamera();
  }, [captureFromFileInput, captureFromCamera]);

  const reset = useCallback(() => {
    setState({ photo: null, error: null, loading: false });
  }, []);

  return {
    ...state,
    capture,
    captureFromFileInput,
    captureFromCamera,
    reset,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
