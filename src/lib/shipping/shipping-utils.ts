export function clampPackageMetrics(input: {
  weight?: unknown;
  length?: unknown;
  breadth?: unknown;
  height?: unknown;
}) {
  return {
    safeWeight: Math.max(0.1, Number(input.weight) || 0.5),
    safeLength: Math.max(10, Number(input.length) || 0),
    safeBreadth: Math.max(10, Number(input.breadth) || 0),
    safeHeight: Math.max(5, Number(input.height) || 0),
  };
}

export function extractShiprocketToken(json: unknown) {
  const j = json as Record<string, unknown> | null;
  const tokenFromRoot = j && typeof j["token"] === "string" ? (j["token"] as string) : undefined;
  const tokenFromData =
    j && typeof j["data"] === "object" && j["data"] !== null && typeof (j["data"] as Record<string, unknown>)["token"] === "string"
      ? ((j["data"] as Record<string, unknown>)["token"] as string)
      : undefined;
  const tokenFromId = j && typeof j["token_id"] === "string" ? (j["token_id"] as string) : undefined;

  return tokenFromRoot || tokenFromData || tokenFromId;
}
