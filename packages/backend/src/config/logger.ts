import pino from "pino";

const level = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "development" ? "debug" : "info");

const devTransport: pino.TransportSingleOptions = {
  target: "pino/file",
  options: { destination: 1 }, // stdout
};

export const logger = pino({
  level,
  ...(process.env.NODE_ENV === "development"
    ? {
        transport: devTransport,
        formatters: {
          level(label: string) {
            return { level: label };
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      }
    : {
        formatters: {
          level(label: string) {
            return { level: label };
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      }),
});
