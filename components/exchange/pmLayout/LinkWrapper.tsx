import Link from "next/link";
export const LinkWrapper = ({
  url,
  articleExists,
  children,
}: {
  children: any;
  articleExists: boolean;
  url: string;
}) => {
  if (articleExists)
    return (
      <Link href={url} passHref>
        {children}
      </Link>
    );
  return <>{children}</>;
};
