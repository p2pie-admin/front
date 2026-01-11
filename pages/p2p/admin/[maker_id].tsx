import { Center } from "@chakra-ui/react";

import MakerPage from "../../../components/p2p/admin/makerPage";
import Loader from "../../../components/shared/Loader";
import { nullSeo } from "../../../components/shared/UniversalSeo";
import { addHeadersToSearchIndex } from "../../../cache/cache";
import { loadP2PMaker, TTL } from "../../../cache/loadX";
import { ISEO } from "../../../types/general";

type PageProps = {
  maker: any | null;
  seo: ISEO;
};

export default function P2PMakerPage({ maker, seo }: PageProps) {
  if (!maker) {
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Loader size="xl" />
      </Center>
    );
  }

  return <MakerPage maker={maker} seo={seo} />;
}

export async function getStaticProps({
  params,
}: {
  params: { maker_id: string };
}) {
  try {
    const { maker_id } = params;
    const maker = await loadP2PMaker(maker_id);

    if (!maker) {
      console.log(`❌ P2P maker failed to load: ${maker_id}`);
      return { notFound: true };
    }

    const displayName =
      maker.telegram_name || maker.telegram_username || maker.id;
    const title = `P2P мейкер ${displayName}`;
    const description = `${displayName}: карточка P2P мейкера`;

    const seo: ISEO = {
      title,
      description,
      canonicalSlug: `p2p/admin/${maker_id}`,
      updatedAt: maker.createdAt || new Date().toISOString(),
    };

    await addHeadersToSearchIndex({
      slug: `p2p/admin/${maker_id}`,
      header: `P2P мейкер ${displayName}`,
      wordsToSearchFrom: displayName,
    });

    return {
      props: {
        maker,
        seo,
      },
      revalidate: TTL.slow,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);

    return {
      props: {
        maker: null,
        seo: nullSeo,
      },
      revalidate: TTL.slow,
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
