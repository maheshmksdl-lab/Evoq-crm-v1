/* eslint-disable @next/next/no-img-element */
// EVOQ CRM logo. Two variants are rendered and swapped with CSS (html.dark) so
// there is no theme flash on load: the dark variant has a white wordmark.
export default function Logo({
  height = 28,
  alt = "EVOQ CRM",
  className = "",
  onError,
}: {
  height?: number;
  alt?: string;
  className?: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}) {
  const style = { height: `${height}px`, width: "auto", flexShrink: 0 } as const;
  return (
    <>
      <img src="/logo.png" alt={alt} style={style} onError={onError} className={`block dark:hidden ${className}`} />
      <img src="/logo-dark.png" alt={alt} style={style} onError={onError} className={`hidden dark:block ${className}`} />
    </>
  );
}
