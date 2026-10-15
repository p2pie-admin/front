// Helpers used by the generated English page copies in pages/xen (see scripts/gen-en-pages.js).
type Ctx = Record<string, any>;
type Gsp = (ctx: Ctx) => Promise<any> | any;

export const withEnglish = (gsp?: Gsp) => async (ctx: Ctx) => {
  if (!gsp) return { props: { locale: "en" } };
  const result = await gsp({ ...ctx, locale: "en" });
  if (result && "props" in result) return { ...result, props: { ...(await result.props), locale: "en" } };
  return result;
};

// English copies are rendered on demand only.
export const englishPaths = async () => ({ paths: [], fallback: "blocking" as const });
