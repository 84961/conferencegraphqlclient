The caching behavior you're observing is due to Apollo Client's built-in cache. Here's a detailed explanation:

Apollo Client automatically caches query results in its normalized cache (InMemoryCache)
When using watchQuery, Apollo returns cached data first and then fetches from network
The filtering is happening client-side using the cached data
Let's verify this by modifying the SessionsService to see the caching in action:

To force network requests instead of using cache, you could:

Use fetchPolicy: 'network-only' to always fetch from server
Use no-cache to never cache
Use the clearCache() method when needed
Common fetch policies:

cache-first (default): Check cache first, only fetch if not in cache
cache-and-network: Return cache first, then update from network
network-only: Always fetch from network, but cache result
no-cache: Always fetch from network, don't cache
cache-only: Only check cache, never fetch from network
This explains why you're seeing filtered results immediately - Apollo is using cached data for the client-side filtering in your component.


Apollo Client uses cache identifiers and cache policies to manage cache validity. Let's add some explicit cache configuration to understand and control this behavior.

Steps to demonstrate and control cache behavior:

Configure type policies and cache identification
Add cache control parameters to queries
Add cache debugging to service

The key points about Apollo's cache management:

Cache Identification: Uses unique IDs (configured in typePolicies) to identify and normalize data
Cache Policies:
    cache-first: Default, uses cache if available
    cache-and-network: Returns cache then updates from network
    network-only: Always fetches fresh data
Cache Invalidation:
    Automatic on mutations
    Manual using refetchQueries or resetStore
Field-Level Caching: Can configure how individual fields are cached and merged
Cache Persistence: Can be configured to persist between sessions
The cache is considered valid until:

A mutation explicitly invalidates it
The cache is manually cleared
The application is reloaded (unless persistence is configured)
A new network request updates the cached data
