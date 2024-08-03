import { json, LoaderFunctionArgs } from "@remix-run/node";
import { StorefrontContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { storefront } = await authenticate.public.appProxy(request);
  //todo: get the store current url
  //todo: find the mapped isoCode by prefix matching the database url and current url (as in table MarketsDomainCountry)
  let isoCode = ""
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
}) {
  return await storefront?.graphql(
    `#graphql
    query allVariantsPrices @inContext(country: ${isoCode}) {
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




