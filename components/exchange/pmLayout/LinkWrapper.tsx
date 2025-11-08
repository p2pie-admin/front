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
  if (exists)
    return (
      <Link
        href={url}
        passHref
        target={_blank ? "_blank" : undefined}
        rel={_blank ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  return <>{children}</>;
};
