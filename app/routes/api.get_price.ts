import { json, LoaderFunctionArgs } from "@remix-run/node";
import { StorefrontContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { storefront, admin } = await authenticate.public.appProxy(request);
  //   let response = await getPriceUsingAdminApi({admin});
  let allPrices = await getPriceUsingStorefrontApi({ storefront });
  let allPricesData = await allPrices?.json();
    let allMarkets = await getAllMarkets({ storefront });
    let allMarketsData = await allMarkets?.json();
  let allMarketUrls = await getAllMarketsURLs({ admin });
  let allMarketUrlsData = await allMarketUrls?.json();
  return json({ allPricesData, allMarketsData, allMarketUrlsData });
};
async function getPriceUsingAdminApi({
  admin,
}: {
  admin: AdminApiContext<ShopifyRestResources> | undefined;
}) {
  return await admin?.graphql(
    `#graphql
            query GetVariantPrices {
                productVariant(id: "gid://shopify/ProductVariant/43285704212651") {
                    CanadaPrice: contextualPricing(context: {country: CA}) {
                    price {
                        amount
                        currencyCode
                    }
                    }
                    USPrice: contextualPricing(context: {country: US}) {
                    price {
                        amount
                        currencyCode
                    }
                    }
                    UkrainPrice: contextualPricing(context: {country: UA}) {
                    price {
                        amount
                        currencyCode
                    }
                    }
                    IndiaPrice: contextualPricing(context: {country: IN}) {
                    price {
                        amount
                        currencyCode
                    }
                    }
                }
                }
        `,
  );
}

async function getPriceUsingStorefrontApi({
  storefront,
}: {
  storefront:
    | import("node_modules/@shopify/shopify-app-remix/dist/ts/server/clients").StorefrontContext
    | undefined;
}) {
  return await storefront?.graphql(
    `#graphql
    query allVariantsPrices @inContext(country: UA) {
  product(id: "gid://shopify/Product/7832303370411") {
        variants(first: 1) {
          edges {
            node {
              price {
                amount
                currencyCode
              }
            }
          }
        }
  }
}
    `,
  );
}

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
        markets(first: 4) {
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
