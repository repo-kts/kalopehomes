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
    { name: 'Modular Kitchen', slug: 'modular-kitchen' },
    { name: 'Wardrobes', slug: 'wardrobes' },
    { name: 'Full Home Interiors', slug: 'full-home-interiors' },
    { name: 'Living Room', slug: 'living-room' },
    { name: 'Bedroom', slug: 'bedroom' },
    { name: 'Renovation', slug: 'renovation' },
  ];
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { ...c, status: 'PUBLISHED', isFeatured: i < 3, sortOrder: i },
      update: {},
    });
  }
  console.log(`✔ Seeded ${categories.length} categories`);
}

async function seedSampleProduct() {
  const kitchen = await prisma.category.findUnique({ where: { slug: 'modular-kitchen' } });
  const kitchenRoom = await prisma.room.findUnique({ where: { slug: 'kitchen' } });
  const modern = await prisma.style.findUnique({ where: { slug: 'modern' } });
  if (!kitchen) return;

  const existing = await prisma.product.findUnique({ where: { slug: 'l-shaped-modern-kitchen' } });
  if (existing) return;

  await prisma.product.create({
    data: {
      name: 'L-Shaped Modern Kitchen',
      slug: 'l-shaped-modern-kitchen',
      shortDescription: 'A sleek L-shaped modular kitchen with soft-close cabinetry.',
      description:
        'Space-efficient L-shaped layout featuring a matte-finish acrylic shutter, quartz countertop and integrated appliance provisions.',
      startingPrice: 185000,
      priceUnit: 'onwards',
      status: 'PUBLISHED',
      isFeatured: true,
      categoryId: kitchen.id,
      specs: { layout: 'L-shaped', finish: 'Acrylic matte', countertop: 'Quartz' },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d',
            alt: 'L-shaped modern kitchen',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      ...(kitchenRoom ? { rooms: { create: [{ roomId: kitchenRoom.id }] } } : {}),
      ...(modern ? { styles: { create: [{ styleId: modern.id }] } } : {}),
    },
  });
  console.log('✔ Seeded sample product');
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
  await seedSampleProduct();
  await seedCms();
  console.log('✅ Seed complete');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
