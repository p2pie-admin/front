import Link from "next/link";
import { ReactNode } from "react";

export const LinkWrapper = ({
  url,
  exists,
  children,
  _blank = false,
}: {
  children: ReactNode;
  exists: boolean;
  url: string;
  _blank?: boolean;
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

  if (exists)
    return (
      <Link
        href={href}
        passHref
        target={_blank ? "_blank" : undefined}
        rel={_blank ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  return <>{children}</>;
};
