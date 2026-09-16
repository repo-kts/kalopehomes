import type { Prisma } from '@prisma/client';

import {
  buildMeta,
  paginationArgs,
  parseSort,
  type ListQuery,
} from '../../lib/pagination';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import type { CreateProductInput, UpdateProductInput } from './products.schema';

const include = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' } },
  styles: { include: { style: { select: { id: true, name: true, slug: true } } } },
} satisfies Prisma.SubCategoryInclude;

export interface ProductListFilters extends ListQuery {
  status?: string;
  categoryId?: string;
  isFeatured?: string;
}

export async function listProducts(query: ProductListFilters) {
  const where: Prisma.SubCategoryWhereInput = {};
  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: 'insensitive' } },
      { slug: { contains: query.q, mode: 'insensitive' } },
      { sku: { contains: query.q, mode: 'insensitive' } },
    ];
  }
  if (query.status) where.status = query.status as Prisma.EnumContentStatusFilter['equals'];
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.isFeatured === 'true') where.isFeatured = true;
  if (query.isFeatured === 'false') where.isFeatured = false;

  const [data, total] = await Promise.all([
    prisma.subCategory.findMany({
      where,
      include,
      orderBy: parseSort(query.sort, ['name', 'sortOrder', 'createdAt', 'startingPrice'], {
        createdAt: 'desc',
      }),
      ...paginationArgs(query),
    }),
    prisma.subCategory.count({ where }),
  ]);

  return { data, meta: buildMeta(total, query) };
}

export async function getProduct(id: string) {
  const subCategory = await prisma.subCategory.findUnique({ where: { id }, include });
  if (!subCategory) throw new HttpError(404, 'Sub-category not found');
  return subCategory;
}

export async function createProduct(input: CreateProductInput) {
  const { styleIds, images, ...scalars } = input;
  return prisma.subCategory.create({
    data: {
      ...scalars,
      specs: scalars.specs as Prisma.InputJsonValue | undefined,
      images: images?.length ? { create: images } : undefined,
      styles: styleIds?.length
        ? { create: styleIds.map((styleId) => ({ styleId })) }
        : undefined,
    },
    include,
  });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const { styleIds, images, ...scalars } = input;

  // Relations are fully replaced when provided (idempotent PATCH of the set).
  return prisma.$transaction(async (tx) => {
    const exists = await tx.subCategory.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new HttpError(404, 'Sub-category not found');

    if (images) {
      await tx.subCategoryImage.deleteMany({ where: { subCategoryId: id } });
    }
    if (styleIds) {
      await tx.subCategoryStyle.deleteMany({ where: { subCategoryId: id } });
    }

    return tx.subCategory.update({
      where: { id },
      data: {
        ...scalars,
        specs: scalars.specs as Prisma.InputJsonValue | undefined,
        images: images?.length ? { create: images } : undefined,
        styles: styleIds?.length
          ? { create: styleIds.map((styleId) => ({ styleId })) }
          : undefined,
      },
      include,
    });
  });
}

export async function deleteProduct(id: string) {
  await prisma.subCategory.delete({ where: { id } });
}
