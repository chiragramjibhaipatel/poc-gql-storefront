import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "~/db.server";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const storefront_access_token =
    new admin.rest.resources.StorefrontAccessToken({ session: session });
  console.log("storefront_access_token", storefront_access_token);

  storefront_access_token.title = "Test";
  await storefront_access_token.save({
    update: true,
  });

  console.log(storefront_access_token);

  // await db.storefront.create({
  //   data: {
  //     accessToken: storefront_access_token.access_token || "",
  //     sccessScope: storefront_access_token.access_scope || "",
  //     shop: session.shop,
  //   },
  // });
  await db.storefront.upsert({
    where: { shop: session.shop },
    create: {
      accessToken: storefront_access_token.access_token || "",
      sccessScope: storefront_access_token.access_scope || "",
      shop: session.shop,
    },
    update: {
      accessToken: storefront_access_token.access_token || "",
      sccessScope: storefront_access_token.access_scope || "",
    },
  });
  console.log("storefront access token is saved");

  return json({ storefront_access_token });
};
