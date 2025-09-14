export const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g;

export function parseMessageWithLinks(text: string) {
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    // URLの前のテキスト部分
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }

    // URL部分
    parts.push({
      type: 'link',
      content: match[0],
      url: match[0]
    });

    lastIndex = match.index + match[0].length;
  }

  // 残りのテキスト部分
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  return parts;
}