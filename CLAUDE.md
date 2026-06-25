@AGENTS.md

This is a production grade PRD and analysis, built specifically for your selected technology stack and optimised for real world launch, not prototype development.

---

## Product Overview
**Elevator Pitch**: A multi-vendor ecommerce marketplace, allowing independent sellers to list products, and buyers to browse, search and purchase goods.
**Primary Business Goal**: Achieve positive gross transaction value within 30 days of launch. Secondary goal: 2.5% minimum conversion rate.
**Explicit Assumptions**:
* This is a multi-vendor marketplace, not a single brand store
* Marketplace will take a percentage commission on all transactions
* Initial launch will be desktop first with responsive mobile support
* No native apps planned for the first 12 months
**Success Metrics**:
* Visit to purchase conversion rate: >2%
* Cart abandonment rate: <70%
* Search to add to cart rate: >8%
* Seller approval rate: >15%

---

## User Personas
| Persona | Description | Core Motivation |
|---|---|---|
| Guest Buyer | Any unauthenticated visitor | Buy a product as fast as possible, no account creation |
| Registered Buyer | User with an account | Track orders, faster repeat checkout |
| Casual Seller | Individual selling small volume | List an item in <5 minutes, get paid |
| Professional Seller | Business doing >$10k/month turnover | Bulk management, reporting, low fees |
| Support Agent | First line support | Resolve user issues quickly |
| Marketplace Admin | Owner / operator | Moderate content, maximise revenue |

---

## Roles & Permissions
All permissions are deny by default.

| Permission | Guest | Buyer | Seller | Support | Admin |
|---|---|---|---|---|---|
| Browse / search products | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add to cart | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkout | ✅ | ✅ | ✅ | ❌ | ✅ |
| View own orders | ❌ | ✅ | ✅ | ❌ | ✅ |
| Create product listing | ❌ | ❌ | ✅ | ❌ | ✅ |
| Edit own listings | ❌ | ❌ | ✅ | ❌ | ✅ |
| Edit any listing | ❌ | ❌ | ❌ | ✅ | ✅ |
| Refund order | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ban user | ❌ | ❌ | ❌ | ❌ | ✅ |
| Modify commission | ❌ | ❌ | ❌ | ❌ | ✅ |
| View system analytics | ❌ | ❌ | ❌ | ❌ | ✅ |

> **Auth Recommendation**: Use Auth.js (Next Auth v5). 15 minute stateless JWT for API access, http only secure refresh token. Support Google and Magic Link only for MVP. Do not implement username/password authentication, it is a net negative for conversion and security.

---

## Core Features
### Public Frontend
* Server side rendered product catalog
* Full text search, filtering and sorting
* Static generation for product pages for SEO
* Public seller profile pages

### Buyer Features
* Guest checkout
* Persistent cart that merges on login
* Order history and tracking
* Transactional email notifications

### Seller Features
* Seller application and onboarding
* Product listing editor
* Inventory management
* Order fulfilment interface

### Admin Features
* Seller approval workflow
* Content moderation
* Global order management
* Basic system dashboard

### System Features
* Automated commission splitting
* Rate limiting and abuse prevention
* Immutable audit logging for all admin actions

---

## MVP Scope
This is the exact and complete set of features you will build first. You can launch a real profitable business with this feature set. No exceptions.

✅ All public catalog features
✅ Full text search and basic filtering
✅ Guest checkout
✅ Persistent merged cart
✅ Manual seller approval
✅ Basic product editor
✅ Order tracking
✅ Stripe Connect payments and automatic commissions
✅ Transactional email
✅ Magic link + Google OAuth
✅ Basic admin dashboard

---

## Out of Scope for MVP
All of these can be added within 2 weeks after launch, and will sink your MVP schedule if you try to build them now.

❌ Coupons, discounts, promotions
❌ Product reviews and ratings
❌ Wishlists
❌ Returns and refunds workflow
❌ Bulk product upload
❌ Seller analytics
❌ On site chat / support tickets
❌ Password authentication
❌ Multi currency
❌ Multi language

### Future Roadmap
* v1.1 (2 weeks post launch): Reviews, wishlists, refunds
* v1.2 (4 weeks post launch): Coupons, bulk upload
* v1.3: Advanced search, personalisation
* v2.0: Seller subscription tiers

---

## User Stories
* As a Guest I can browse and search products so I can find what I want
* As a Guest I can checkout without creating an account so I can buy as fast as possible
* As a Guest my cart is saved for 90 days so I can come back later
* As a Buyer my cart is merged when I login so I don't lose items
* As a Buyer I can view all my past orders so I can track them
* As a Seller I can apply to sell on the marketplace
* As a Seller I can create and edit product listings
* As a Seller I get an email when I receive a new order
* As an Admin I can approve or reject seller applications
* As an Admin I can remove any listing for moderation

---

## Acceptance Criteria
All features must meet these unambiguous testable criteria before being marked as done:

* Cart items are merged not duplicated when a guest logs in
* Checkout requires exactly 4 fields: name, email, address, phone
* Confirmation email is sent within 60 seconds of successful payment
* Search returns results in <200ms at 10,000 products
* A seller can not modify a product after it has been sold
* All payment operations are idempotent
* A seller can never view orders belonging to another seller
* All admin actions are logged with user, timestamp and full change delta
* Product pages return a 200 status and valid meta tags for crawlers

---

## Risks
### Business Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Chicken and egg: no sellers = no buyers, no buyers = no sellers | High | Critical | Seed marketplace with 100 dummy products. Onboard 10 sellers before opening to buyers. |
| Payment fraud and chargebacks | High | High | Use Stripe Radar. Hold all seller payouts for 14 days for MVP. |
| Prohibited / illegal listings | High | High | Manual approval of all new listings for MVP. |
| Cart abandonment >80% | Medium | High | Guest checkout is the default and only recommended option. |

### Technical Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Search performance degrades above 5000 products | High | Medium | Use Postgres full text search for MVP, migrate to Elasticsearch at 20k products. |
| Next.js cache invalidation for product pages | High | Medium | Use explicit revalidate tags. Never use indefinite static generation. |
| Double payment on failed checkout | Medium | Critical | Mandatory idempotency keys for all payment API calls. |
| Inventory race conditions | Medium | High | All inventory updates run inside database transactions. Never update inventory in application code. |

---

## Questions I must answer before coding starts
These are not optional. Every single one of these will have major architectural and business implications. If you guess you will have to rewrite 50% of the code later.

1. What percentage commission will the marketplace take?
2. What is the payout schedule for sellers?
3. What payment methods will be supported?
4. What product categories are allowed and prohibited?
5. Who is responsible for shipping, returns and customer support?
6. What is the maximum order value for MVP?
7. Will sellers require identity verification before approval?
8. What is your hard launch date?

---

Would you like me to expand on any section, or provide a full technical architecture and phase 1 implementation plan for your exact stack?