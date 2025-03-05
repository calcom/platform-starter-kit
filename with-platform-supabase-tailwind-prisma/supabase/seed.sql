--
-- Data for Name: FilterOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "prisma"."FilterOption" ("fieldId", "fieldValue", "fieldLabel", "createdAt", "filterCategoryFieldId", "filterCategoryValue", "filterCategoryLabel") VALUES
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
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
	('c5d8d6fe-8be5-4476-8aca-f102e63be12e', '3f5160803fe82395ea1343a296457bd40a893640b02a6cc4e5389c15736825fb', '2024-06-15 09:39:06.676328+00', '20240615093906_init', NULL, NULL, '2024-06-15 09:39:06.628549+00', 1);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
-- commenting out as this currently doesn't work with vercel integration
-- INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
-- 	('avatars', 'avatars', NULL, '2024-06-14 11:51:12.750831+00', '2024-06-14 11:51:12.750831+00', true, false, NULL, '{image/jpeg,image/png}', NULL);