#!/usr/bin/env node
/**
 * PreToolUse hook — 카카오톡 나챗방(KakaotalkChat-MemoChat) 전송 직전에 돈다.
 *
 * 「[채용 브리핑]」으로 시작하는 메시지만 검사한다. 다른 플러그인(증시 · 복지 ·
 * 공항)의 메시지는 그대로 통과시킨다.
 *
 * 막는 경우
 *   1. 200자를 넘는다 (나챗방 도구 한도)
 *   2. 첫 줄에 「기준」 날짜가 없다 (화면에서 읽은 시점을 밝히지 않은 것으로 간주)
 *   3. 과장된 채용 추천 말이 들어 있다 (무조건 합격 · 스펙 보장 · 100% 합격)
 */

const PREFIX = "[채용 브리핑]";
const LIMIT = 200;
const OVERPROMISE = /(무조건\s*합격|스펙\s*보장|100%\s*합격|합격\s*보장)/;

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `${reason}\n고쳐서 다시 보내세요.`,
      },
    }),
  );
  process.exit(0);
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => {
  raw += c;
});
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const args = input.tool_input || {};
  const msg = Object.values(args).find(
    (v) => typeof v === "string" && v.startsWith(PREFIX),
  );
  if (!msg) process.exit(0);

  if (msg.length > LIMIT)
    deny(`메시지가 ${msg.length}자입니다. ${LIMIT}자 이내로 줄이세요.`);
  if (!msg.split("\n")[0].includes("기준"))
    deny("첫 줄에 「… 기준」 날짜가 없습니다.");
  const hit = msg.match(OVERPROMISE);
  if (hit)
    deny(`과장된 채용 추천 말(「${hit[0]}」)이 있습니다. 사실만 적으세요.`);
  process.exit(0);
});
