export type SubtitleSegment = {
  start: string;
  end: string;
  text: string;
};

export type ExtractResponse = {
  session_id: string;
  subtitles: SubtitleSegment[];
  available_subtitle_languages: string[];
};

export type TranslateResponse = {
  session_id?: string;
  subtitles: SubtitleSegment[];
};

export type TTSResponse = {
  session_id?: string;
  audio_url: string;
  audio_path: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function requestJson<T>(input: string, init: RequestInit): Promise<T> {
  try {
    const response = await fetch(input, init);
    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Cannot connect to API at ${API_BASE_URL}. Start backend + worker, then retry.`,
      );
    }
    throw error;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let detail = "Request failed";
  try {
    const data = (await response.json()) as { detail?: string };
    detail = data.detail || detail;
  } catch {
    detail = `${detail} (${response.status})`;
  }
  throw new Error(detail);
}

export async function extractSubtitles(url: string, sourceLang = "en"): Promise<ExtractResponse> {
  return requestJson<ExtractResponse>(`${API_BASE_URL}/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, source_lang: sourceLang }),
  });
}

export async function translateSubtitles(params: {
  sessionId?: string;
  subtitles?: SubtitleSegment[];
  sourceLang?: string;
  targetLang: string;
}): Promise<TranslateResponse> {
  return requestJson<TranslateResponse>(`${API_BASE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: params.sessionId,
      subtitles: params.subtitles ?? [],
      source_lang: params.sourceLang ?? "en",
      target_lang: params.targetLang,
    }),
  });
}

export async function generateTTS(params: {
  sessionId?: string;
  subtitles?: SubtitleSegment[];
  text?: string;
}): Promise<TTSResponse> {
  return requestJson<TTSResponse>(`${API_BASE_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: params.sessionId,
      subtitles: params.subtitles ?? [],
      text: params.text,
    }),
  });
}

export function buildDownloadSrtUrl(sessionId: string, subtitleType: "original" | "translated" = "translated") {
  return `${API_BASE_URL}/download/srt?session_id=${encodeURIComponent(sessionId)}&subtitle_type=${subtitleType}`;
}

export function buildDownloadTxtUrl(sessionId: string, subtitleType: "original" | "translated" = "translated") {
  return `${API_BASE_URL}/download/txt?session_id=${encodeURIComponent(sessionId)}&subtitle_type=${subtitleType}`;
}

export function resolveStaticUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${API_BASE_URL}${pathOrUrl}`;
}
