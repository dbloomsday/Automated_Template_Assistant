# InstantCard API Endpoints (v1 & v2)

> Base URL (production): `https://core.instantcard.net/api`  
> Base URL (staging): `https://staging.core.instantcard.net/api`  

*All requests after authentication require `Authorization: bearer <auth_token>` header.*

---

## v2 Endpoints  

| Area | Verb | Path (prepend `/v2/`) | Purpose |
|------|------|-----------------------|---------|
| **Auth** | POST | `/authenticate` | Exchange email+password for `auth_token`. |
|  | GET  | `/profile/me` | Current‑user profile. |
| **Templates (read‑only)** | GET | `/organizations/{organization_id}/card_templates` | List template IDs & names. |
|  | GET | `/organizations/{organization_id}/card_templates/{template_id}/fields` | Variable fields required by template. |
| **Cards** | POST | `/organizations/{organization_id}/cards` | Create draft card from a template. |
|  | GET | `/organizations/{organization_id}/cards/{card_id}/preview` | Base‑64 PNGs for draft (front/back). |
|  | PATCH | `/organizations/{organization_id}/cards/{card_id}` | Update draft/final card data. |
|  | PATCH | `/organizations/{organization_id}/cards/{card_id}/finalize` | Lock card for printing. |
| **Print‑jobs** | POST | `/organizations/{organization_id}/print_jobs` | Create a print‑job “cart”. |
|  | POST | `/organizations/{organization_id}/print_jobs/{id}/add_cards` | Add card IDs to job. |
|  | GET | `/organizations/{organization_id}/print_jobs/{id}/check_balance` | Confirm funds for job. |
|  | POST | `/organizations/{organization_id}/print_jobs/{id}/print` | Submit job to production. |

---

## v1 Endpoints  

### 1 – Authentication & Profile

| Verb | Path | Purpose |
|------|------|---------|
| POST | `/authenticate` | Obtain `auth_token`. |
| GET  | `/profile/me` | Current‑user profile. |

### 2 – Card Templates (CRUD)

| Verb | Path | Required Query/Path Params | Notes |
|------|------|----------------------------|-------|
| POST | `/card_templates` | `organization_id` (query) | Create template.<br/>Body (form‑urlencoded): `card_template[name]`, `card_template[card_type_id]`, optional JSON strings `card_template[front_data]`, `back_data`, `options`, `template_fields`, `card_data`, `special_handlings`. |
| PATCH | `/card_templates/{id}` | `organization_id` (query), `id` (path) | Update template (same body keys as POST; send only those to change). |
| DELETE | `/card_templates/{id}` | `organization_id` (query), `id` (path) | Delete template. |
| GET | `/card_templates` | `organization_id` (query), `page`, `page_size` | List templates. |
| GET | `/card_templates/{id}` | `organization_id` (query), `id` (path) | Fetch template metadata. |
| POST | `/card_templates/{id}/upload` | `organization_id` (query), `id` (path) | Attach image file (`image`) to template. |
| DELETE | `/card_templates/{id}/destroy_image/{image_id}` | `organization_id` (query), `id` (template), `image_id` (path) | Delete attached image. |

### 3 – Card Drafts / Previews / Finalise

| Verb | Path | Purpose |
|------|------|---------|
| POST | `/organizations/{org_id}/cards` | Create draft card (`card_template_id`, `card[data]`). |
| GET | `/organizations/{org_id}/cards/{card_id}/preview` | Render PNG preview (Base64). |
| PATCH | `/organizations/{org_id}/cards/{card_id}` | Update card data. |
| PATCH | `/organizations/{org_id}/cards/{card_id}/finalize` | Finalise card. |

### 4 – Print Jobs

| Verb | Path | Required Params | Notes |
|------|------|-----------------|-------|
| GET | `/print_jobs` | `organization_id` (query) | Optional: `page`, `page_size`, `status`. |
| POST | `/print_jobs` | `organization_id` (query) | Body: `print_job[name]`, `card_template_id`, optional `shipping_provider_id`, `list_users`, `status`. |
| POST | `/print_jobs/{id}/add_users` | `organization_id` (query), `id` (path) | Body: `print_job[list_users]` (card IDs). |
| PUT | `/print_jobs/{id}/print` | `organization_id` (query), `id` (path) | Body: optional `print_job[shipping_provider_id]`. |
| GET | `/print_jobs/{id}` | `organization_id` (query), `id` (path) | Fetch job details. |

### 5 – Organization Auxiliary

| Verb | Path | Purpose |
|------|------|---------|
| GET | `/organizations` | List orgs (`page`, `page_size`). |
| GET | `/organizations/{id}/letters` | Org letters. |
| GET | `/organizations/{id}/fonts` | Org fonts. |
| GET | `/organizations/{id}/special_handlings` | Org special handling options. |
| GET | `/organizations/search?search_string=…` | Search orgs by name. |

---

> **Tip:** When calling v1 endpoints, omit the `/v2/` segment shown in v2 examples; payload shapes and bearer‑token auth remain the same.

