import Link from "next/link";
import { MouseEvent, ReactNode } from "react";

export const LinkWrapper = ({
  url,
  exists,
  children,
  _blank = false,
  className,
  style,
}: {
  children: ReactNode;
  exists: boolean;
  url: string;
  _blank?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const normalizeHref = (href: string) => {
    if (!href) return href;

    const trimmed = href.trim();
    const protocolMatch = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed);

    if (protocolMatch) {
      const [protocol, ...rest] = trimmed.split("://");
      const normalizedRest = rest.join("://").replace(/\/{2,}/g, "/");
      return `${protocol}://${normalizedRest}`;
    }

    const withoutProtocolRelative = trimmed.replace(/^\/{2,}/, "/");
    const collapsed = withoutProtocolRelative.replace(/\/{2,}/g, "/");
    return collapsed.startsWith("/") ? collapsed : `/${collapsed}`;
  };

  const href = normalizeHref(url);
  const isExternal =
    !!href && /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href) && !href.startsWith("/");
  const relayHref = _blank && isExternal ? "/v" : href;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (_blank && isExternal && href) {
      e.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  if (exists)
    return (
      <Link
        href={relayHref}
        onClick={handleClick}
        passHref
        target={_blank ? "_blank" : undefined}
        rel={_blank ? "nofollow noopener noreferrer" : undefined}
        className={className}
        style={style}
      >
        {children}
      </Link>
    );
  return <>{children}</>;
};
