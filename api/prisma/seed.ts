import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { SYSTEM_ROLES } from '../src/lib/permissions';

const prisma = new PrismaClient();

async function seedRoles() {
  for (const role of SYSTEM_ROLES) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      create: { ...role, isSystem: true },
      update: { name: role.name, description: role.description, permissions: role.permissions },
    });
  }
  console.log(`✔ Seeded ${SYSTEM_ROLES.length} system roles`);
}

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@kalopehomes.com').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345';
  const name = process.env.SEED_ADMIN_NAME ?? 'Super Admin';

  const superAdmin = await prisma.role.findUniqueOrThrow({ where: { slug: 'super-admin' } });
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    create: { name, email, passwordHash, roleId: superAdmin.id },
    update: { roleId: superAdmin.id },
  });
  console.log(`✔ Super admin ready: ${email}`);
}

async function seedTaxonomies() {
  const rooms = [
    'Kitchen',
    'Living Room',
    'Master Bedroom',
    'Kids Room',
    'Bathroom',
    'Home Office',
    'Dining Room',
    'Pooja Room',
  ];
  for (const [i, name] of rooms.entries()) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.room.upsert({
      where: { slug },
      create: { name, slug, sortOrder: i, isActive: true },
      update: {},
    });
  }

  const styles = ['Modern', 'Contemporary', 'Minimalist', 'Scandinavian', 'Rustic', 'Industrial'];
  for (const [i, name] of styles.entries()) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.style.upsert({
      where: { slug },
      create: { name, slug, sortOrder: i, isActive: true },
      update: {},
    });
  }
  console.log(`✔ Seeded ${rooms.length} rooms and ${styles.length} styles`);
}

async function seedCategories() {
  const categories = [
    {
      name: 'Modular Kitchen',
      slug: 'modular-kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d',
    },
    {
      name: 'Wardrobes',
      slug: 'wardrobes',
      imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8',
    },
    {
      name: 'Full Home Interiors',
      slug: 'full-home-interiors',
      imageUrl: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87',
    },
    {
      name: 'Living Room',
      slug: 'living-room',
      imageUrl: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897',
    },
    {
      name: 'Bedroom',
      slug: 'bedroom',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
    },
    {
      name: 'Renovation',
      slug: 'renovation',
      imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
    },
  ];
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { ...c, status: 'PUBLISHED', isFeatured: i < 3, sortOrder: i },
      update: {},
    });
    await prisma.category.updateMany({
      where: { slug: c.slug, imageUrl: null },
      data: { imageUrl: c.imageUrl },
    });
  }
  console.log(`✔ Seeded ${categories.length} categories`);
}

async function seedProducts() {
  const categories = await prisma.category.findMany({
    where: { slug: { in: ['modular-kitchen', 'wardrobes', 'living-room', 'bedroom'] } },
  });
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  const products = [
    {
      name: 'L-Shaped Modern Kitchen',
      slug: 'l-shaped-modern-kitchen',
      categorySlug: 'modular-kitchen',
      shortDescription: 'Soft-close cabinetry, engineered stone counters and appliance integration.',
      description: 'A space-efficient kitchen designed around the way you cook and built to your plan.',
      startingPrice: 185000,
      specs: { layout: 'L-shaped', finish: 'Acrylic matte', countertop: 'Quartz' },
      imageUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d',
      imageAlt: 'A modular kitchen with pale cabinetry and stone counters',
      isFeatured: true,
    },
    {
      name: 'Wardrobes & Storage',
      slug: 'wardrobes-and-storage',
      categorySlug: 'wardrobes',
      shortDescription: 'Floor-to-ceiling wardrobes, walk-ins and loft storage for every millimetre.',
      description: 'Storage configured around what you own, with fitted interiors and soft-close hardware.',
      startingPrice: 95000,
      specs: { type: 'Floor-to-ceiling', hardware: 'Soft-close', storage: 'Loft included' },
      imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8',
      imageAlt: 'A fitted wardrobe with open shelving',
    },
    {
      name: 'TV & Media Units',
      slug: 'tv-and-media-units',
      categorySlug: 'living-room',
      shortDescription: 'Wall-length media walls with concealed cables, lighting and display niches.',
      description: 'A considered media wall that gives the living room storage without visual clutter.',
      startingPrice: 75000,
      specs: { cableManagement: 'Concealed', lighting: 'Integrated', storage: 'Closed and open niches' },
      imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c',
      imageAlt: 'A living room with a built-in media wall',
    },
    {
      name: 'Bedroom Sets',
      slug: 'bedroom-sets',
      categorySlug: 'bedroom',
      shortDescription: 'Beds, side tables, headboard panelling and reading light designed as one piece.',
      description: 'A quieter bedroom scheme with coordinated joinery, storage and warm layered lighting.',
      startingPrice: 120000,
      specs: { included: 'Bed, side tables, headboard', lighting: 'Integrated reading lights' },
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      imageAlt: 'A bedroom with panelled headboard and side tables',
    },
  ];

  for (const [sortOrder, product] of products.entries()) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) continue;

    const { categorySlug: _categorySlug, imageUrl, imageAlt, ...data } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        ...data,
        categoryId: category.id,
        priceUnit: 'onwards',
        status: 'PUBLISHED',
        sortOrder,
        images: { create: [{ url: imageUrl, alt: imageAlt, isPrimary: true }] },
      },
      update: {},
    });
  }
  console.log(`✔ Seeded ${products.length} catalog products`);
}

async function seedCms() {
  const heroCount = await prisma.heroSlide.count();
  if (heroCount === 0) {
    await prisma.heroSlide.create({
      data: {
        title: 'Home to beautiful interiors',
        subtitle: 'Get a personalised design and quote from our experts.',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
        ctaText: 'Book free consultation',
        ctaLink: '/consultation',
        placement: 'HOME_HERO',
        isActive: true,
      },
    });
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.create({
      data: {
        authorName: 'Priya Sharma',
        authorLocation: 'Bengaluru',
        rating: 5,
        quote: 'The team transformed our apartment beyond our expectations. Seamless from quote to handover.',
        isActive: true,
      },
    });
  }

  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.create({
      data: {
        question: 'How does the quotation process work?',
        answer:
          'Share your requirements, our designer prepares a detailed quote, and you proceed only when you are happy with it.',
        category: 'Pricing',
        isActive: true,
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: 'contact' },
    create: {
      key: 'contact',
      group: 'contact',
      value: { phone: '+91 90000 00000', email: 'hello@kalopehomes.com' },
    },
    update: {},
  });
  await prisma.setting.upsert({
    where: { key: 'stats' },
    create: {
      key: 'stats',
      group: 'stats',
      value: { homesDelivered: '10,000+', cities: '25+', designers: '200+' },
    },
    update: {},
  });
  console.log('✔ Seeded CMS content and settings');
}

async function main() {
  console.log('🌱 Seeding database...');
  await seedRoles();
  await seedAdmin();
  await seedTaxonomies();
  await seedCategories();
  await seedProducts();
  await seedCms();
  console.log('✅ Seed complete');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
