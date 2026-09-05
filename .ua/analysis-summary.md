# MatchaLog source analysis

MatchaLog is a matcha catalog and personal collection prototype. Product discovery, product details, reviews, and stash display have read implementations. Recipes, profiles, and collection editing remain incomplete.

## Architecture

Client React pages in `app/` fetch Next.js API route handlers. Those handlers query Supabase through the shared [database client](../lib/supabase.js). The source references three tables: `matcha_products`, `reviews`, and `user_stash`; stash queries include related product records.

The [root layout](../app/layout.js) supplies page metadata and [global CSS](../app/globals.css). Each page repeats its navigation markup. A [shared constant](../lib/constants.js) supplies a fixed user identity for navigation and stash loading; no authentication flow was found in `app/` or `lib/`.

## Implemented read flows

- [Discover](../app/page.js) uses a 300 ms debounced search and pagination with 12 products per page. The [products API](../app/api/products/route.js) searches product names, orders by creation date, and returns a count alongside the requested range.
- [Product details](../app/products/[productId]/page.js) fetch the [individual product API](../app/api/products/[productId]/route.js), then the [reviews API](../app/api/reviews/[productId]/route.js). The page displays product information and existing reviews.
- [Stash](../app/stash/[userStash]/page.js) loads the fixed user's collection through the [stash API](../app/api/stash/[userStash]/route.js). It displays product details, stored status, and rating. The API filters by its user route parameter, while the page supplies the shared constant rather than its own route parameter.

## Incomplete features

- The product page's **Add to Stash** button and review submission form have no mutation handlers. The stash status selector and **Delete** button also have no persistence handlers. No mutation route exports were found in `app/api/`.
- The [recipes list](../app/recipes/page.js) defines a fetch function but never invokes it or populates its recipe state. Its `/api/recipes` collection endpoint has no route file.
- The [recipe detail page](../app/recipes/[recipeId]/page.js) references undefined `paramsl` and `product` variables. Its [detail API](../app/api/recipes/[recipeId]/route.js) contains an empty GET handler.
- The [profile page](../app/profile/[userId]/page.js) contains a top-level return without an exported page component. The [profile API](../app/api/profile/[userId]/route.js) contains only an import.

## Verification scope

These findings come from static inspection of `app/` and `lib/`. No application build, browser flow, automated test, or database query was run for this report. Environment-file contents were not read. Implemented read flows describe source behavior, not confirmed live availability or database configuration.
