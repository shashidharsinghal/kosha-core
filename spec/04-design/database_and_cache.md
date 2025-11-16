# Database and Cache Design

Kosha uses a combination of databases and caches to store and retrieve data efficiently.  Choosing the right store for each data category balances flexibility, consistency and performance.

| Data category         | Suggested store    | Rationale |
|----------------------|---------------------|-----------|
| Bills, income entries, expenses, notifications | **MongoDB** | Flexible document schema allows rapid iteration across heterogeneous financial objects (bills, incomes, expenses, notifications).  Documents can vary in shape and are well‑suited for unstructured or semi‑structured data.  MongoDB’s schema validator adds basic structure without rigid tables. |
| Users, sessions, investment portfolios, payments & mandates | **PostgreSQL** | These entities involve relational integrity and complex queries.  User authentication requires unique constraints and sessions; investment monitoring needs joins across assets and transactions; payments demand ACID consistency.  PostgreSQL provides strong consistency and powerful SQL for these workloads【163388115766043†L297-L302】. |
| Caching dashboards, recent imports, session tokens | **Redis** | An in‑memory cache speeds up frequent reads and reduces load on the primary databases.  Redis stores session tokens, dashboard summaries and derived results with short TTLs. |

These choices are not rigid.  If the system evolves and needs more relational structure or analytics, additional databases (e.g. analytical warehouses) can be introduced.  For the initial MVP, the three stores above provide a good balance of flexibility and reliability.
