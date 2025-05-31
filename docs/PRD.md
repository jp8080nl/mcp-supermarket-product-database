# Product Requirements Document: Supermarket Price Comparator (NL) - Release 1

## 1. App Overview and Objectives

**Overview:**
A system to collect, store, and display product and pricing data from Dutch supermarkets, initially focusing on Albert Heijn and Jumbo in the Noord-Holland region. The system will track price developments over time. For Release 1, the primary output will be a simple web application allowing users to search for products and compare current prices between the targeted supermarkets.

This project aims to provide users with data to make informed decisions about where to do their groceries to save money. Release 1 focuses on building the foundational data pipeline and a basic user interface.

**Objectives for Release 1:**
*   Successfully collect product information (name, brand, price, size, categories, promotions, etc.) from Albert Heijn (AH) and Jumbo.
*   Store this data reliably in a structured database (Supabase/PostgreSQL).
*   Track historical prices for each product.
*   Develop a simple web frontend (Vue.js) where users can search for products and view their current prices at AH and Jumbo.
*   Automate the data collection process using n8n.
*   Establish a basic data model for supermarket chains and their branches (for future geographical features), though pricing for Release 1 is at the national/chain level.

## 2. Target Audience

*   **Initial Users (Release 1):** Primarily the developers/project owner for testing and validation. The simple web frontend will serve as a proof-of-concept.
*   **Eventual Users (Post-Release 1):** Consumers in Noord-Holland (and later, potentially all of the Netherlands) who are looking to save money on their groceries by comparing prices and identifying the cheapest supermarket(s) for their needs.

## 3. Core Features and Functionality (Release 1)

### 3.1. Data Collection Backend
*   **FC-001: Albert Heijn Data Scraper:**
    *   Utilize Python scripts (leveraging existing libraries like `AppiePy` or `SupermarktConnector`) to fetch product data from Albert Heijn's public/internal APIs.
    *   Collected data points: `store_product_id`, `product_name`, `brand`, `categories` (raw JSON), `package_description`, `package_quantity`, `package_unit`, `barcode_ean`, `image_url`, `current_price_cents`, `unit_price_amount_cents`, `unit_price_unit_description`, `is_on_promotion`, `promotion_description`, `promotion_original_price_cents`.
    *   Assume national pricing (no per-branch price differences for AH).
*   **FC-002: Jumbo Data Scraper:**
    *   Utilize Python scripts (leveraging existing libraries like `JumboConnector` or `SupermarktConnector`) to fetch product data from Jumbo's public/internal APIs.
    *   Collected data points: Same as FC-001.
    *   Assume national pricing (no per-branch price differences for Jumbo).
*   **FC-003: Data Storage:**
    *   Store collected data in the Supabase (PostgreSQL) database according to the defined schema (see Section 5).
    *   New products are inserted into the `products` table.
    *   Product price updates are recorded as new entries in the `price_history` table with a timestamp.
    *   `expiration_category` in `products` table will be `NULL` initially for most products.
*   **FC-004: Data Collection Automation:**
    *   Use n8n to schedule and orchestrate the execution of the AH and Jumbo Python scraper scripts.
    *   Scripts should run at least once daily.
    *   Basic logging of script execution (success/failure) via n8n.
*   **FC-005: Supermarket Branch Data (Initial Population - Manual/Separate Script):**
    *   Populate the `supermarkets` table with "Albert Heijn" and "Jumbo".
    *   Populate the `supermarket_branches` table with known AH and Jumbo locations in Noord-Holland (including address, postal code, city, latitude, longitude). This data is for future use and might be sourced separately/manually initially.

### 3.2. Simple Web Frontend
*   **FC-006: Product Search:**
    *   Provide an input field for users to search for products by name (and potentially brand).
*   **FC-007: Product Price Display:**
    *   Display search results in a table format.
    *   For each product, show: `product_name`, `brand`, `package_description`, `supermarket.name` (chain), `current_price_cents` (formatted as Euros), `unit_price_amount_cents` (formatted), `promotion_description` (if any).
    *   Prices displayed should be the most recent ones from the `price_history` table.
*   **FC-008: Basic Filtering:**
    *   Allow users to filter results by supermarket chain (AH, Jumbo).

## 4. Technical Stack Recommendations

*   **Docker:** Docker for containerization to ensure consistent environments and protect local dev environment
*   **GitHub:** GitHub for version control and code collaboration
*   **GitHub Projects:** GitHub Projects for project management and task tracking
*   **Backend Data Collection:** Python (with libraries like `requests`, `SupermarktConnector`, `AppiePy`)
*   **Automation/Orchestration:** n8n
*   **Database:** Supabase (PostgreSQL)
*   **Frontend Framework:** Vue.js
*   **Frontend API Communication:** `supabase-js` library to interact with Supabase's auto-generated REST APIs.
*   **Hosting (Frontend):** Static site hosting (e.g., Netlify, Vercel, GitHub Pages) for the Vue.js app.
*   **Hosting (n8n):** Self-hosted or n8n.cloud.

## 5. Conceptual Data Model (Supabase/PostgreSQL)

### 5.1. `supermarkets` Table (Chains)
| Column Name | Data Type     | Constraints/Notes                 |
| :---------- | :------------ | :-------------------------------- |
| `id`        | `UUID`        | Primary Key, auto-generated       |
| `name`      | `TEXT`        | Not Null, UNIQUE                  |
| `logo_url`  | `TEXT`        | Nullable                          |
| `website_url`| `TEXT`        | Nullable                          |
| `created_at`| `TIMESTAMPTZ` | Not Null, default `now()`         |

### 5.2. `supermarket_branches` Table (Locations)
| Column Name           | Data Type     | Constraints/Notes                                                      |
| :-------------------- | :------------ | :--------------------------------------------------------------------- |
| `id`                  | `UUID`        | Primary Key, auto-generated                                            |
| `supermarket_id`      | `UUID`        | Not Null, FK to `supermarkets.id`                                      |
| `branch_name`         | `TEXT`        | Nullable                                                               |
| `address_line1`       | `TEXT`        | Nullable                                                               |
| `postal_code`         | `TEXT`        | Nullable                                                               |
| `city`                | `TEXT`        | Nullable                                                               |
| `latitude`            | `NUMERIC`     | Nullable (for future radius search)                                    |
| `longitude`           | `NUMERIC`     | Nullable (for future radius search)                                    |
| `branch_external_id`  | `TEXT`        | Nullable (chain's specific ID for the branch)                          |
| `created_at`          | `TIMESTAMPTZ` | Not Null, default `now()`                                              |
*(Data for this table to be sourced for Noord-Holland branches of AH & Jumbo)*

### 5.3. `products` Table
| Column Name             | Data Type     | Constraints/Notes                                                        |
| :---------------------- | :------------ | :----------------------------------------------------------------------- |
| `id`                    | `UUID`        | Primary Key, auto-generated                                              |
| `supermarket_id`        | `UUID`        | Not Null, FK to `supermarkets.id`                                        |
| `store_product_id`      | `TEXT`        | Not Null (chain's ID for the product)                                    |
| `product_name`          | `TEXT`        | Not Null                                                                 |
| `brand`                 | `TEXT`        | Nullable                                                                 |
| `categories`            | `JSONB`       | Nullable (store-specific categories)                                     |
| `package_description`   | `TEXT`        | Nullable                                                                 |
| `package_quantity`      | `NUMERIC`     | Nullable                                                                 |
| `package_unit`          | `TEXT`        | Nullable                                                                 |
| `barcode_ean`           | `TEXT`        | Nullable                                                                 |
| `image_url`             | `TEXT`        | Nullable                                                                 |
| `expiration_category`   | `TEXT`        | Nullable (Values like "Long", "Medium", "Short". Populated in future release) |
| `created_at`            | `TIMESTAMPTZ` | Not Null, default `now()`                                                |
| `updated_at`            | `TIMESTAMPTZ` | Not Null, default `now()` (for product detail changes, not price)        |
| *Unique Constraint:* `UNIQUE (supermarket_id, store_product_id)`                                                      |

### 5.4. `price_history` Table
| Column Name                      | Data Type     | Constraints/Notes                                         |
| :------------------------------- | :------------ | :-------------------------------------------------------- |
| `id`                             | `UUID`        | Primary Key, auto-generated                               |
| `product_id`                     | `UUID`        | Not Null, FK to `products.id` ON DELETE CASCADE           |
| `price_datetime`                 | `TIMESTAMPTZ` | Not Null                                                  |
| `current_price_cents`            | `INTEGER`     | Not Null (price in cents)                                 |
| `unit_price_amount_cents`        | `INTEGER`     | Nullable                                                  |
| `unit_price_unit_description`    | `TEXT`        | Nullable                                                  |
| `is_on_promotion`                | `BOOLEAN`     | Not Null, default `FALSE`                                 |
| `promotion_description`          | `TEXT`        | Nullable                                                  |
| `promotion_original_price_cents` | `INTEGER`     | Nullable                                                  |
| `created_at`                     | `TIMESTAMPTZ` | Not Null, default `now()`                                 |
*Index Suggestion:* `CREATE INDEX idx_price_history_product_datetime ON price_history (product_id, price_datetime DESC);`

## 6. UI Design Principles (Release 1)

*   **Simplicity:** The interface should be clean, uncluttered, and easy to understand.
*   **Functionality-focused:** Prioritize core tasks: searching and viewing prices.
*   **Responsiveness (Basic):** Should be usable on desktop browsers. Full mobile optimization can be a future enhancement.
*   **Clarity:** Clearly display product information, prices, and supermarket origin.
*   **Performance:** Frontend should load quickly and display search results efficiently. Vue.js and Supabase API calls should facilitate this.

## 7. Security Considerations

*   **Supabase API Keys:**
    *   The `service_role` key MUST be kept secret and only used in the n8n Python scripts (server-side). Store it securely within n8n's credential management.
    *   The `anon` (anonymous) key will be used by the Vue.js frontend. This key is public.
*   **Supabase Row Level Security (RLS):**
    *   **CRITICAL:** Enable RLS on all data tables (`products`, `price_history`, `supermarkets`, `supermarket_branches`).
    *   Define RLS policies to allow **read-only (`SELECT`) access** for the `anon` role on these tables for the frontend.
    *   No `INSERT`, `UPDATE`, or `DELETE` RLS policies should be granted to the `anon` role for these tables. Data modification is handled exclusively by the backend scrapers using the `service_role` key (which bypasses RLS).
*   **Input Sanitization:** While the frontend is primarily display-only, any search input should be handled safely to prevent XSS if reflected, though modern frameworks like Vue.js provide good protection.
*   **Rate Limiting (Frontend):** Not a primary concern for Release 1 given the nature of the app, but Supabase has some built-in protections.

## 8. Development Phases/Milestones (Release 1 Focus)

1.  **Phase 1: Setup & Backend Foundation**
    *   Set up Supabase project.
    *   Implement database schema in Supabase.
    *   Develop Python scraper for Albert Heijn (data fetching & parsing).
    *   Integrate AH scraper with Supabase (writing to `products` and `price_history`).
    *   Test AH scraper thoroughly.
2.  **Phase 2: Second Supermarket & Automation**
    *   Develop Python scraper for Jumbo.
    *   Integrate Jumbo scraper with Supabase.
    *   Test Jumbo scraper thoroughly.
    *   Set up n8n workflow to schedule and run both scrapers daily.
    *   Implement basic logging and failure notification in n8n.
3.  **Phase 3: Frontend Development**
    *   Set up Vue.js project.
    *   Implement UI for product search and filtering.
    *   Integrate with Supabase API (`supabase-js`) to display product and price data.
    *   Basic styling and usability testing.
4.  **Phase 4: Data Population & Deployment**
    *   Perform initial data seeding for `supermarket_branches` (Noord-Holland).
    *   Deploy Vue.js frontend to a static hosting provider.
    *   Final testing of the end-to-end system.

## 9. Potential Challenges and Solutions

*   **Challenge:** Unofficial supermarket APIs change or implement stronger anti-scraping measures.
    *   **Solution:** Design scrapers modularly for easier updates. Stay informed via developer communities. Implement robust error handling and monitoring. Be prepared to explore proxy services if necessary. Adhere to polite scraping practices (delays, User-Agents).
*   **Challenge:** Sourcing and maintaining `supermarket_branches` data.
    *   **Solution:** Look for official store locator APIs or reliable public datasets. For Release 1, manual compilation for Noord-Holland might be feasible. This is not on the critical path for price collection if national pricing holds.
*   **Challenge:** Data consistency and quality from scraped sources (e.g., varying category names, missing EANs).
    *   **Solution:** For Release 1, store data largely as-is (e.g., categories in JSONB). Future releases can focus on data cleaning and normalization. Implement sanity checks in scrapers (e.g., are prices within an expected range?).
*   **Challenge:** Initial population of `expiration_category`.
    *   **Solution:** Defer to a future release. For Release 1, this field will be `NULL` or use very basic heuristics if time permits.

## 10. Future Expansion Possibilities (Post-Release 1)

*   Add more supermarket chains.
*   Expand geographical coverage beyond Noord-Holland.
*   Implement user accounts (e.g., to save shopping lists, preferred stores).
*   Develop AI model for shopping list optimization (suggesting cheapest store(s)).
*   Implement advanced filtering and sorting on the frontend.
*   Crowdsource/allow user input for `expiration_category` or product corrections.
*   Build a mobile application.
*   Track stock availability.
*   Visualize price history trends.
*   Integrate with receipt scanning.

---