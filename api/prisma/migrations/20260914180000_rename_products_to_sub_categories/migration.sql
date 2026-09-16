ALTER TABLE "products" RENAME TO "sub_categories";
ALTER TABLE "product_images" RENAME TO "sub_category_images";
ALTER TABLE "product_rooms" RENAME TO "sub_category_rooms";
ALTER TABLE "product_styles" RENAME TO "sub_category_styles";

ALTER TABLE "sub_category_images" RENAME COLUMN "productId" TO "subCategoryId";
ALTER TABLE "sub_category_rooms" RENAME COLUMN "productId" TO "subCategoryId";
ALTER TABLE "sub_category_styles" RENAME COLUMN "productId" TO "subCategoryId";
ALTER TABLE "leads" RENAME COLUMN "productId" TO "subCategoryId";
ALTER TABLE "quote_items" RENAME COLUMN "productId" TO "subCategoryId";

ALTER INDEX "products_slug_key" RENAME TO "sub_categories_slug_key";
ALTER INDEX "products_sku_key" RENAME TO "sub_categories_sku_key";
ALTER INDEX "products_categoryId_idx" RENAME TO "sub_categories_categoryId_idx";
ALTER INDEX "products_status_idx" RENAME TO "sub_categories_status_idx";
ALTER INDEX "products_isFeatured_idx" RENAME TO "sub_categories_isFeatured_idx";
ALTER INDEX "product_images_productId_idx" RENAME TO "sub_category_images_subCategoryId_idx";

ALTER TABLE "sub_categories" RENAME CONSTRAINT "products_pkey" TO "sub_categories_pkey";
ALTER TABLE "sub_category_images" RENAME CONSTRAINT "product_images_pkey" TO "sub_category_images_pkey";
ALTER TABLE "sub_category_rooms" RENAME CONSTRAINT "product_rooms_pkey" TO "sub_category_rooms_pkey";
ALTER TABLE "sub_category_styles" RENAME CONSTRAINT "product_styles_pkey" TO "sub_category_styles_pkey";
ALTER TABLE "sub_category_images" RENAME CONSTRAINT "product_images_productId_fkey" TO "sub_category_images_subCategoryId_fkey";
ALTER TABLE "sub_category_rooms" RENAME CONSTRAINT "product_rooms_productId_fkey" TO "sub_category_rooms_subCategoryId_fkey";
ALTER TABLE "sub_category_styles" RENAME CONSTRAINT "product_styles_productId_fkey" TO "sub_category_styles_subCategoryId_fkey";
ALTER TABLE "leads" RENAME CONSTRAINT "leads_productId_fkey" TO "leads_subCategoryId_fkey";
ALTER TABLE "quote_items" RENAME CONSTRAINT "quote_items_productId_fkey" TO "quote_items_subCategoryId_fkey";
