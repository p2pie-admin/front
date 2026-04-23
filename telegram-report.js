const fs = require("fs");
const path = require("path");

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizeAuthorName(value) {
  return value.replace(/\s+/g, " ").trim();
}

function extractAuthorsFromTelegramHtml(raw) {
  const counts = new Map();
  const matches = raw.matchAll(
    /<div class="from_name">([\s\S]*?)<\/div>/gi,
  );

  for (const match of matches) {
    const author = normalizeAuthorName(stripTags(match[1]));
    if (!author) continue;
    counts.set(author, (counts.get(author) || 0) + 1);
  }

  return counts;
}

const MONTHS = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

const CUTOFF_TIMESTAMP = Date.UTC(2026, 0, 1, 0, 0, 0);

function parseDateLine(value) {
  const match = value.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = MONTHS[match[2].toLowerCase()];
  const year = Number(match[3]);
  if (month === undefined) return null;
  return { day, month, year };
}

function buildTimestamp(dateParts, timeLine) {
  if (!dateParts) return null;
  const match = timeLine.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return new Date(
    Date.UTC(dateParts.year, dateParts.month, dateParts.day, hours, minutes),
  );
}

function isBeforeCutoff(timestamp) {
  return Boolean(timestamp && timestamp.getTime() < CUTOFF_TIMESTAMP);
}

function formatTimestamp(timestamp) {
  if (!timestamp) return "Не удалось определить";
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(timestamp);
}

function parseTelegramPlainTextMessages(raw) {
  const messages = [];
  const lines = raw.split(/\r?\n/);
  const isDateLine = (value) => Boolean(parseDateLine(value));
  const isTimeLine = (value) => /^\d{1,2}:\d{2}$/.test(value);
  const isMetaLine = (value) =>
    value === "In reply to this message" ||
    value === "Sticker" ||
    value.startsWith("Not included, change data exporting settings");
  const looksLikeAuthor = (value) => {
    if (!value || value.length > 80) return false;
    if (isDateLine(value) || isTimeLine(value) || isMetaLine(value)) return false;
    if (/^https?:\/\//i.test(value)) return false;
    if (/^[@/#.]/.test(value)) return false;
    return true;
  };

  let currentDate = null;
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (isDateLine(line)) {
      currentDate = parseDateLine(line);
      index += 1;
      continue;
    }
    if (!isTimeLine(line)) {
      index += 1;
      continue;
    }

    const block = [];
    index += 1;
    while (index < lines.length) {
      const nextLine = lines[index].trim();
      if (isTimeLine(nextLine) || isDateLine(nextLine)) break;
      if (nextLine) block.push(nextLine);
      index += 1;
    }

    if (block.length < 2) continue;

    const author = normalizeAuthorName(block[0]);
    if (!looksLikeAuthor(author)) continue;
    const text = block.slice(1).join(" ").replace(/\s+/g, " ").trim();
    messages.push({
      author,
      timestamp: buildTimestamp(currentDate, line),
      text,
    });
  }

  return messages;
}

function extractAuthorStats(raw) {
  const htmlCounts = extractAuthorsFromTelegramHtml(raw);
  if (htmlCounts.size) {
    return Array.from(htmlCounts.entries())
      .map(([name, messages]) => ({
        name,
        messages,
        lastMessageAt: null,
        sampleMessage: null,
        recencyRatio: 0,
        activityScore: messages,
      }))
      .sort(
        (a, b) =>
          b.activityScore - a.activityScore ||
          b.messages - a.messages ||
          a.name.localeCompare(b.name, "ru"),
      );
  }

  const messages = parseTelegramPlainTextMessages(raw);
  const authors = new Map();

  for (const message of messages) {
    const current = authors.get(message.author) || {
      name: message.author,
      messages: 0,
      lastMessageAt: null,
      sampleMessage: null,
    };
    current.messages += 1;
    if (
      message.timestamp &&
      (!current.lastMessageAt || message.timestamp > current.lastMessageAt)
    ) {
      current.lastMessageAt = message.timestamp;
      current.sampleMessage = message.text || current.sampleMessage;
    } else if (!current.sampleMessage && message.text) {
      current.sampleMessage = message.text;
    }
    authors.set(message.author, current);
  }

  const timestamps = messages
    .map((item) => item.timestamp)
    .filter(Boolean)
    .map((item) => item.getTime());
  const oldestTimestamp = timestamps.length ? Math.min(...timestamps) : null;
  const latestTimestamp = timestamps.length ? Math.max(...timestamps) : null;
  const range = oldestTimestamp !== null && latestTimestamp !== null
    ? latestTimestamp - oldestTimestamp
    : 0;

  return Array.from(authors.values())
    .filter((item) => !item.lastMessageAt || !isBeforeCutoff(item.lastMessageAt))
    .map((item) => {
      const lastTime = item.lastMessageAt ? item.lastMessageAt.getTime() : null;
      const recencyRatio =
        range > 0 && lastTime !== null
          ? (lastTime - oldestTimestamp) / range
          : 0;
      const activityScore = item.messages * (1 + recencyRatio);
      return {
        ...item,
        recencyRatio,
        activityScore: Number(activityScore.toFixed(3)),
      };
    })
    .sort(
      (a, b) =>
        b.activityScore - a.activityScore ||
        b.messages - a.messages ||
        (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0) ||
        a.name.localeCompare(b.name, "ru"),
    );
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtmlReport(stats, sourceFileName) {
  const totalMessages = stats.reduce((sum, item) => sum + item.messages, 0);
  const rows = stats.length
    ? stats
        .map(
          (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.name)}</td>
          <td>${item.messages}</td>
          <td>${escapeHtml(item.sampleMessage || "Нет данных")}</td>
          <td>${escapeHtml(formatTimestamp(item.lastMessageAt))}</td>
          <td>${item.activityScore.toFixed(3)}</td>
        </tr>`,
        )
        .join("")
    : `
        <tr>
          <td colspan="6">Сообщения не найдены. Проверь формат или содержимое исходного файла.</td>
        </tr>`;

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Telegram Report</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f1ea;
      --panel: #fffaf3;
      --text: #2a211b;
      --muted: #7a6b60;
      --line: #dfd2c4;
      --accent: #c46d3b;
    }
    body {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      background: linear-gradient(180deg, #efe6da 0%, var(--bg) 100%);
      color: var(--text);
    }
    main {
      max-width: 920px;
      margin: 0 auto;
      padding: 40px 20px 64px;
    }
    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(89, 60, 38, 0.08);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 34px;
    }
    p {
      margin: 0;
      color: var(--muted);
    }
    .meta {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      margin: 20px 0 28px;
      font-size: 15px;
    }
    .meta strong {
      color: var(--accent);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      overflow: hidden;
      border-radius: 14px;
    }
    th, td {
      padding: 14px 12px;
      border-bottom: 1px solid var(--line);
      text-align: left;
    }
    th {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    tr:last-child td {
      border-bottom: 0;
    }
    td:first-child, th:first-child {
      width: 72px;
    }
    td:last-child, th:last-child {
      width: 160px;
      text-align: right;
    }
    @media (max-width: 640px) {
      h1 {
        font-size: 28px;
      }
      th, td {
        padding: 12px 10px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="card">
      <h1>Авторы сообщений Telegram</h1>
      <p>Сортировка по activityScore: число сообщений, усиленное свежестью последнего сообщения автора.</p>
      <div class="meta">
        <span><strong>Источник:</strong> ${escapeHtml(sourceFileName)}</span>
        <span><strong>Аккаунтов:</strong> ${stats.length}</span>
        <span><strong>Сообщений:</strong> ${totalMessages}</span>
        <span><strong>Фильтр:</strong> до 01.01.2026</span>
        <span><strong>Формула:</strong> messages × (1 + recencyRatio)</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Аккаунт</th>
            <th>Сообщений</th>
            <th>Пример сообщения</th>
            <th>Последнее сообщение</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>${rows}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`;
}

function generateTelegramReport(inputPath, outputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  const stats = extractAuthorStats(raw);
  const html = renderHtmlReport(stats, path.basename(inputPath));
  fs.writeFileSync(outputPath, html, "utf8");
  return stats;
}

if (require.main === module) {
  const inputPath = path.resolve(process.cwd(), "telegram.txt");
  const outputPath = path.resolve(process.cwd(), "telegram-result.html");
  const stats = generateTelegramReport(inputPath, outputPath);
  console.log(
    `Report created: ${path.basename(outputPath)} (${stats.length} authors)`,
  );
}

module.exports = {
  extractAuthorStats,
  generateTelegramReport,
  renderHtmlReport,
};
