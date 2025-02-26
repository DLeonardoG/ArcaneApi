export function MarkdownLite({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="prose-lite">