SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: CalAccount; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: FilterOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."FilterOption" ("fieldId", "fieldValue", "fieldLabel", "createdAt", "filterCategoryFieldId", "filterCategoryValue", "filterCategoryLabel") VALUES
	('freelancer', 'freelancer', 'Freelancer', '2024-06-12 16:34:56.508', 'categories', 'categories', 'Category'),
	('agency', 'agency', 'Agency', '2024-06-12 16:34:56.508', 'categories', 'categories', 'Category'),
	('product_studio', 'product_studio', 'Product Studio', '2024-06-12 16:34:56.508', 'categories', 'categories', 'Category'),
	('ecommerce', 'ecommerce', 'Ecommerce', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('product_management', 'product_management', 'Product Management', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('app_development', 'app_development', 'App Development', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('design', 'design', 'Design', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('ui_ux', 'ui_ux', 'UI/UX Development', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('integration_services', 'integration_services', 'Integration Services', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('branding', 'branding', 'Branding', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('digital_marketing', 'digital_marketing', 'Digital Marketing', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('mobile_development', 'mobile_development', 'Mobile Development', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('ai', 'ai', 'AI', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('web3-crypto', 'web3-crypto', 'Web3 / Crypto', '2024-06-12 16:34:56.508', 'capabilities', 'capabilities', 'Capabilities'),
	('nextjs', 'nextjs', 'Next.js', '2024-06-12 16:34:56.508', 'frameworks', 'frameworks', 'Frameworks'),
	('nuxtjs', 'nuxtjs', 'Nuxt.js', '2024-06-12 16:34:56.508', 'frameworks', 'frameworks', 'Frameworks'),
	('svelte', 'svelte', 'Svelte', '2024-06-12 16:34:56.508', 'frameworks', 'frameworks', 'Frameworks'),
	('gatsby', 'gatsby', 'Gatsby', '2024-06-12 16:34:56.508', 'frameworks', 'frameworks', 'Frameworks'),
	('angular', 'angular', 'Angular', '2024-06-12 16:34:56.508', 'frameworks', 'frameworks', 'Frameworks'),
	('ember', 'ember', 'Ember', '2024-06-12 16:34:56.508', 'frameworks', 'frameworks', 'Frameworks'),
	('vue', 'vue', 'Vue', '2024-06-12 16:34:56.508', 'frameworks', 'frameworks', 'Frameworks'),
	('1000', '1000', '$1,000 - $4,999', '2024-06-12 16:34:56.508', 'budgets', 'budgets', 'Budgets'),
	('5000', '5000', '$5,000 - $9,999', '2024-06-12 16:34:56.508', 'budgets', 'budgets', 'Budgets'),
	('10000', '10000', '$10,000 - $49,999', '2024-06-12 16:34:56.508', 'budgets', 'budgets', 'Budgets'),
	('50000', '50000', '$50,000 - $99,999', '2024-06-12 16:34:56.508', 'budgets', 'budgets', 'Budgets'),
	('100000', '100000', '$100,000+', '2024-06-12 16:34:56.508', 'budgets', 'budgets', 'Budgets'),
	('english', 'english', 'English', '2024-06-12 16:34:56.508', 'languages', 'languages', 'Languages Spoken'),
	('portugese', 'portugese', 'Portuguese', '2024-06-12 16:34:56.508', 'languages', 'languages', 'Languages Spoken'),
	('spanish', 'spanish', 'Spanish', '2024-06-12 16:34:56.508', 'languages', 'languages', 'Languages Spoken'),
	('chinese', 'chinese', 'Chinese', '2024-06-12 16:34:56.508', 'languages', 'languages', 'Languages Spoken'),
	('french', 'french', 'French', '2024-06-12 16:34:56.508', 'languages', 'languages', 'Languages Spoken'),
	('japanese', 'japanese', 'Japanese', '2024-06-12 16:34:56.508', 'languages', 'languages', 'Languages Spoken'),
	('german', 'german', 'German', '2024-06-12 16:34:56.508', 'languages', 'languages', 'Languages Spoken'),
	('asia', 'asia', 'Asia', '2024-06-12 16:34:56.508', 'regions', 'regions', 'Region'),
	('australia', 'australia', 'Australia and New Zealand', '2024-06-12 16:34:56.508', 'regions', 'regions', 'Region'),
	('europe', 'europe', 'Europe', '2024-06-12 16:34:56.508', 'regions', 'regions', 'Region'),
	('latin_america', 'latin_america', 'Latin America', '2024-06-12 16:34:56.508', 'regions', 'regions', 'Region'),
	('middle_east', 'middle_east', 'Middle East', '2024-06-12 16:34:56.508', 'regions', 'regions', 'Region'),
	('north_america', 'north_america', 'North America', '2024-06-12 16:34:56.508', 'regions', 'regions', 'Region'),
	('remote', 'remote', 'Remote', '2024-06-12 16:34:56.508', 'regions', 'regions', 'Region');


--
-- Data for Name: FilterOptionsOnUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."FilterOptionsOnUser" ("userId", "filterOptionFieldId", "filterCategoryFieldId", "createdAt") VALUES
	('clxe510qu00004qzybkdqp01z', '1000', 'budgets', '2024-06-14 03:37:15.286'),
	('clxe510qu00004qzybkdqp01z', 'ecommerce', 'capabilities', '2024-06-14 03:37:15.286'),
	('clxe510qu00004qzybkdqp01z', 'freelancer', 'categories', '2024-06-14 03:37:15.286'),
	('clxe510qu00004qzybkdqp01z', 'nextjs', 'frameworks', '2024-06-14 03:37:15.286'),
	('clxe510qu00004qzybkdqp01z', 'english', 'languages', '2024-06-14 03:37:15.286'),
	('clxe59f5z0000smw3gyivnzr9', '1000', 'budgets', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'ecommerce', 'capabilities', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'app_development', 'capabilities', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'mobile_development', 'capabilities', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'ai', 'capabilities', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'freelancer', 'categories', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'nextjs', 'frameworks', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'angular', 'frameworks', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'english', 'languages', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'german', 'languages', '2024-06-14 03:43:47.223'),
	('clxe59f5z0000smw3gyivnzr9', 'chinese', 'languages', '2024-06-14 03:43:47.223'),
	('clxek5g4d00004jdghfieq2zs', '1000', 'budgets', '2024-06-14 10:40:36.079'),
	('clxek5g4d00004jdghfieq2zs', 'ecommerce', 'capabilities', '2024-06-14 10:40:36.079'),
	('clxek5g4d00004jdghfieq2zs', 'freelancer', 'categories', '2024-06-14 10:40:36.079'),
	('clxek5g4d00004jdghfieq2zs', 'nextjs', 'frameworks', '2024-06-14 10:40:36.079'),
	('clxek5g4d00004jdghfieq2zs', 'english', 'languages', '2024-06-14 10:40:36.079');


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
	('e95b57f7-ff46-4cab-baed-4e64d4b5716d', 'c8f95901b01c27725e12ff60750a8f8d77148bf62092315e1167f87d2261ff41', '2024-06-12 16:34:49.227006+00', '20240612155208_init', NULL, NULL, '2024-06-12 16:34:49.169119+00', 1);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2024-06-14 11:51:12.750831+00', '2024-06-14 11:51:12.750831+00', true, false, NULL, '{image/jpeg,image/png}', NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
