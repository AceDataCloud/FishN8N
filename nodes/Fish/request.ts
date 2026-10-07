import type { IDataObject, IExecuteFunctions } from "n8n-workflow";
import {
  callback,
  choice,
  integer,
  object,
  requiredText,
  publicUrl,
} from "./helpers";
export function buildRequest(
  context: IExecuteFunctions,
  index: number,
): { endpoint: string; body: IDataObject; headers?: IDataObject } {
  const get = (name: string, fallback?: unknown) =>
    context.getNodeParameter(name, index, fallback as IDataObject);
  const operation = String(get("operation"));
  const options = object(get("options", {}));

  choice(operation, "Operation", ["create"]);
  const text = requiredText(get("text"), "Text");
  const model = choice(get("model", "s2-pro"), "Model", [
    "s1",
    "s2-pro",
    "s2.1-pro",
  ]);
  const body: IDataObject = {
    text,
    format: choice(get("format", "mp3"), "Audio Format", ["mp3", "wav", "pcm"]),
    async: true,
  };
  const source = choice(get("voiceSource", "default"), "Voice Source", [
    "default",
    "id",
    "reference",
  ]);
  if (source === "id") {
    const ids = requiredText(get("voiceIds"), "Voice IDs")
      .split(/[,\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
    if (!ids.length) throw new Error("At least one voice ID is required");
    body.reference_id = ids.length === 1 ? ids[0] : ids;
  }
  if (source === "reference") {
    const audio = publicUrl(get("referenceAudioUrl"), "Reference Audio URL");
    if (!audio.startsWith("https://"))
      throw new Error("Reference Audio URL must use HTTPS");
    const transcript = requiredText(
      get("referenceText"),
      "Reference Transcript",
    );
    if (transcript.length > 10000)
      throw new Error(
        "Reference Transcript must contain at most 10000 characters",
      );
    body.references = [{ audio, text: transcript }];
  }
  if (options.latency)
    body.latency = choice(options.latency, "Latency", ["normal", "balanced"]);
  if (typeof options.normalize === "boolean")
    body.normalize = options.normalize;
  if (options.mp3Bitrate !== undefined) {
    const bitrate = integer(options.mp3Bitrate, "MP3 Bitrate", 64, 192);
    if (![64, 128, 192].includes(bitrate))
      throw new Error("MP3 Bitrate must be 64, 128 or 192");
    if (body.format !== "mp3")
      throw new Error("MP3 Bitrate applies only to MP3 output");
    body.mp3_bitrate = bitrate;
  }
  if (options.sampleRate !== undefined)
    body.sample_rate = integer(options.sampleRate, "Sample Rate", 8000, 48000);
  const prosody: IDataObject = {};
  for (const [key, min, max] of [
    ["speed", 0.5, 2],
    ["volume", -20, 20],
  ] as const) {
    const value = options[key];
    if (value !== undefined) {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < min ||
        value > max
      )
        throw new Error(`${key} must be from ${min} to ${max}`);
      prosody[key] = value;
    }
  }
  if (Object.keys(prosody).length) body.prosody = prosody;
  callback(options, body);
  return { endpoint: "/fish/tts", body, headers: { model } };
}
