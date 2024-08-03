import { json, LoaderFunctionArgs } from "@remix-run/node";
import { StorefrontContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import { authenticate } from "~/shopify.server";
import db from '../db.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { storefront, admin, session } = await authenticate.public.appProxy(request);
  let allMarketUrls = await getAllMarketsURLs({ admin });
  let allMarketUrlsData = await allMarketUrls?.json();
  let allMarketUrlsMapping = allMarketUrlsData?.data.markets.nodes.map(
    (node) => {
      return {
        marketId: node.id,
        locale: node.webPresence.rootUrls[0].locale,
        url: node.webPresence.rootUrls[0].url,
      };
    },
  );

  let allMarkets = await getAllMarkets({ storefront });
  let allMarketsData = await allMarkets?.json();
  let availableCountries = allMarketsData?.data.localization.availableCountries;

  allMarketUrlsMapping.forEach((mapping) => {
    let marketId = mapping.marketId;
    let countryForMarketId = availableCountries.find(
      (country) => country.market.id === marketId,
    );
    mapping.isoCode = countryForMarketId.isoCode;
    mapping.shop = session?.shop;
  });
  console.log({allMarketUrlsMapping})
  try{

    await db.marketsDomainCountry.deleteMany({where: {shop: session.shop}})
    await db.marketsDomainCountry.createMany({
      data: [...allMarketUrlsMapping]
    })
  } catch(e){
    console.log(e)

  }

  return json({ allMarketUrlsMapping });
};

async function getAllMarkets({
  storefront,
}: {
  storefront: StorefrontContext | undefined;
}) {
  if (!storefront) {
    return null;
  }
  return await storefront.graphql(
    `#graphql
        query {
        localization {
            
            availableCountries {
            market{
                id
                handle
            }
            currency {
                isoCode
                name
                symbol
            }
            isoCode
            name
            unitSystem
            }
            country {
            currency {
                isoCode
                name
                symbol
            }
            isoCode
            name
            unitSystem
            }
        }
        }`,
  );
}

async function getAllMarketsURLs({
  admin,
}: {
  admin: AdminApiContext<ShopifyRestResources> | undefined;
}) {
  if (!admin) {
    return null;
  }
  return await admin.graphql(
    `#graphql
    query GetMarketUrls {
        markets(first: 250) {
            nodes {
            id
            name
            webPresence {
                rootUrls {
                locale
                url
                }
            }
            }
        }
        }
    `,
  );
}
