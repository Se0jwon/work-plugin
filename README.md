# work-plugin

「채용 공고 브리핑」이라고 하면 **사람인(saramin.co.kr)**에서 백엔드·프론트엔드·AI 세 직군의
채용 공고를 읽어 터미널에 보여 주고, **카카오톡 나챗방**으로도 보내는 Claude Code 플러그인.

```
[채용 브리핑] 백엔드 개발자 · 2026-10-26 기준
1. (OOO) 백엔드 개발자 - 서울
2. (OOO) 서버 개발자 - 판교
출처: 사람인 saramin.co.kr
```

## 설치

```
/plugin marketplace add Se0jwon/work-plugin
/plugin install work-plugin@work-plugin
```

## 전제조건

1. **PlayMCP 도구함에 `사람인`과 `카카오톡 나챗방`** 을 담는다 → https://playmcp.kakao.com/mcp/1
2. **claude.ai 커넥터에 PlayMCP 연결** → https://claude.ai/customize/connectors
   같은 Claude 계정이면 Claude Code 의 `/mcp` 에 `claude.ai PlayMCP` 로 뜬다.
   그래서 이 플러그인은 `.mcp.json` 을 두지 않는다.

사람인 검색과 카톡 전송 모두 PlayMCP MCP 커넥터를 통해서만 이루어진다(Claude in Chrome 불필요).
그래서 claude.ai 클라우드 루틴에서도 그대로 동작한다.

## 매일 09:30 자동 실행

이 플러그인 자체에는 스케줄 기능이 없다(Hook 은 도구 호출 시점에만 돈다).
매일 09:30 자동 실행은 **claude.ai 클라우드 루틴**으로 따로 설정한다:

1. claude.ai 에서 새 루틴을 만들고 주기를 매일 09:30 으로 지정한다.
2. 루틴 프롬프트에 `채용 공고 브리핑` (또는 "오늘 채용 공고 알려줘") 을 넣는다.
3. 루틴에 PlayMCP 커넥터를 연결하고, `mcp__PlayMCP__SaraminMcp-search_saramin_jobs` 와
   `mcp__PlayMCP__KakaotalkChat-MemoChat` 을 허용 도구에 넣는다. (Claude in Chrome 필요 없음.)

## 구성

| 파일 | 하는 일 |
|---|---|
| `skills/job-brief/SKILL.md` | 사람인에서 세 직군 검색 → 터미널 출력 → 나챗방 전송(카테고리당 1건) 순서 |
| `hooks/check-job-message.js` | `[채용 브리핑]` 메시지만 검사 — 200자 · 날짜 유무 · 과장된 합격 보장 말 |
| `.claude-plugin/marketplace.json` | 이 저장소를 장터(`work-plugin`)로 등록 |

## 주의

- 정보 제공용이다. 합격을 보장하는 말은 하지 않는다.
- 공고 제목·회사명은 화면에서 읽은 것만 쓴다. 못 읽으면 `확인 못 함`.
- 사람인 홈페이지 내용은 허락 없이 옮기거나 퍼뜨릴 수 없다 — 결과는 나만 본다.

## 라이선스

MIT
