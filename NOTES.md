## Routing

The routing is all very well and good, but namespaced addrs don't path-ify very well.
Perhaps it's time to look into a more react state based solution for pages, that would also make navigations more interceptable. The only downside is the great obvervability of paths, but I fear that this is such a stateful app that they're less useful than they'd otherwise be

# Persistance issues

There's three seperate lifecycles that need to be considered here:

- Engine: persisted only for the session, handles startup and shutdown and orchestration
- Config: persisted between sessions, and used for all campaigns, should be pretty much a global data store
- Campaign: multiple instances persisted, should be able to pretty seamlessly switch between them at runtime.

Each campaign should be persisted in a seperate siloed DB, and when one campaign is running, the other campaigns should have 0 (or minimal) load

Two ways of handling this come to mind:

- Seperate Actor Systems communicating with transports:

  - Makes it easier to setup realizers: each system only has use 1 single realizer config each. Not sure how to switch up the realizer config to point to different DBs though
  - There will be a lot of traffic flowing through transports, do I think that's going to be a problem?

- Single Actor System with diferentiated realizers:
  - A much more complex single system
  - The logic to switch realizers is probably more complex than the logic for routing transports

Ok, seperate actor systems seems to have won
