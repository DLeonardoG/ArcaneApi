export function MarkdownLite({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="prose-lite">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return <h2 key={index}>{trimmed.slice(3)}</h2>;
        }
        if (trimmed.startsWith("# ")) {
          return <h1 key={index}>{trimmed.slice(2)}</h1>;
        }
        return <p key={index}>{trimmed}</p>;
      })}
    </div>
  );
}
