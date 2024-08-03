import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from '../db.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { storefront } = await authenticate.public.appProxy(request);
  //get the query params from request
  // Get the query params from request
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const {domain} = queryParams
  console.log({ domain });
  const sanitisedDomain = domain.split("/products")[0];
  console.log({ sanitisedDomain });
  const marketDomainCountryData = await db.marketsDomainCountry.findFirst({where: {url: sanitisedDomain + "/"}});
  console.log({ marketDomainCountryData });

  //todo: get the store current url
  //todo: find the mapped isoCode by prefix matching the database url and current url (as in table MarketsDomainCountry)
  let isoCode = marketDomainCountryData?.isoCode ;
  let allPrices = await getPriceUsingStorefrontApi({ storefront, isoCode });
  let allPricesData = await allPrices?.json();
  return json({ allPricesData });
};


async function getPriceUsingStorefrontApi({
  storefront, isoCode
}: {
  storefront:
    | import("node_modules/@shopify/shopify-app-remix/dist/ts/server/clients").StorefrontContext
    | undefined;
    isoCode: string;
}) {
  return await storefront?.graphql(
    `#graphql
    query allVariantsPrices @inContext(country: ${isoCode}) {
  product(id: "gid://shopify/Product/7832303370411") {
        variants(first: 250) {
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




