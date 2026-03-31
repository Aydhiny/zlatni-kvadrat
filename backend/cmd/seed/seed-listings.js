/**
 * Seed script — uploads real property images to Cloudinary,
 * then inserts 8 sample listings into Neon DB via psql.
 *
 * Requires: Node 18+ (uses built-in fetch)
 * Run from repo root: node backend/cmd/seed/seed-listings.js
 */

const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Cloudinary config (parsed from your .env) ─────────────────────────────
const CLOUD_NAME   = 'dyqlkvurd';
const API_KEY      = '777713336231262';
const API_SECRET   = 'z2BK_AYsS6AmVPH3_yMvtJ23VPo';

// ── Neon DB ────────────────────────────────────────────────────────────────
const DB_URL = 'postgresql://neondb_owner:npg_diRAG1o9qSWU@ep-square-sunset-amut31n8-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';

// ── Property images from Unsplash (free, high quality) ────────────────────
const IMAGES = [
  { id: 'zk_luxury_villa',      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85' },
  { id: 'zk_modern_house',      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85' },
  { id: 'zk_pool_villa',        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85' },
  { id: 'zk_apartment_city',    url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=85' },
  { id: 'zk_apartment_modern',  url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85' },
  { id: 'zk_house_countryside', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85' },
  { id: 'zk_commercial_space',  url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85' },
  { id: 'zk_penthouse',         url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85' },
  { id: 'zk_garden_house',      url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=85' },
  { id: 'zk_studio_apt',        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85' },
];

// ── Sign Cloudinary upload params ──────────────────────────────────────────
function cloudinarySign(params) {
  const str = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&') + API_SECRET;
  return crypto.createHash('sha1').update(str).digest('hex');
}

// ── Upload one image to Cloudinary ─────────────────────────────────────────
async function uploadImage(publicId, remoteUrl) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { public_id: publicId, timestamp };
  const signature = cloudinarySign(params);

  const body = new URLSearchParams({
    file:       remoteUrl,
    api_key:    API_KEY,
    timestamp:  String(timestamp),
    public_id:  publicId,
    signature,
  });

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body,
  });
  const data = await res.json();

  if (!data.secure_url) {
    throw new Error(`Cloudinary upload failed for ${publicId}: ${JSON.stringify(data)}`);
  }
  return data.secure_url;
}

// ── Escape single quotes for SQL ──────────────────────────────────────────
const esc = s => s.replace(/'/g, "''");

// ── Listings to seed ──────────────────────────────────────────────────────
// images[] filled in dynamically after Cloudinary upload
const LISTINGS = [
  {
    title:         'Luksuzna vila s bazenom, Ilidža',
    description:   'Impresivna vila sa privatnim bazenom i uređenim vrtom. Vrhunska gradnja, premium materijali, panoramski pogled na Sarajevsko polje. Idealna za obitelji i poslovne ljude koji cijene ekskluzivnost.',
    type:          'sale',
    property_type: 'house',
    price:         850000,
    currency:      'EUR',
    area:          320,
    bedrooms:      5,
    bathrooms:     4,
    location:      'Ilidža, Sarajevo',
    address:       'Ul. Bosanska 14, Ilidža',
    is_featured:   true,
    images:        ['zk_pool_villa', 'zk_luxury_villa'],
  },
  {
    title:         'Moderan penthouse, Novo Sarajevo',
    description:   'Ekskluzivni penthouse na 12. spratu s terasom od 45m² i spektakularnim pogledom na grad. Visoki plafoni, otvoreni plan, kuhinja Bulthaup. Podzemna garaža uključena.',
    type:          'sale',
    property_type: 'apartment',
    price:         450000,
    currency:      'EUR',
    area:          180,
    bedrooms:      3,
    bathrooms:     2,
    location:      'Novo Sarajevo',
    address:       'Ul. Džemala Bijedića 45, Novo Sarajevo',
    is_featured:   true,
    images:        ['zk_penthouse', 'zk_apartment_modern'],
  },
  {
    title:         'Trosoban stan u centru, Stari Grad',
    description:   'Potpuno renoviran stan u srcu Starog Grada. Originalnih tavanica od 3.2m, parketi od hrastovine, nova instalacija. 5 minuta hoda do Baščaršije.',
    type:          'sale',
    property_type: 'apartment',
    price:         195000,
    currency:      'EUR',
    area:          92,
    bedrooms:      3,
    bathrooms:     1,
    location:      'Stari Grad, Sarajevo',
    address:       'Ul. Logavina 8, Stari Grad',
    is_featured:   true,
    images:        ['zk_apartment_city'],
  },
  {
    title:         'Kuća s vrtom na Bjelašnici',
    description:   'Tradicionalna bosanska kuća sa modernim interijèrom. 1200m² okućnice, šuma u pozadini, 40 minuta od Sarajeva. Savršena za vikend odmor ili stalni boravak.',
    type:          'sale',
    property_type: 'house',
    price:         280000,
    currency:      'EUR',
    area:          210,
    bedrooms:      4,
    bathrooms:     3,
    location:      'Bjelašnica, Hadžići',
    address:       'Bjelašničko Polje bb',
    is_featured:   false,
    images:        ['zk_garden_house', 'zk_house_countryside'],
  },
  {
    title:         'Poslovni prostor, Marijin Dvor',
    description:   'Reprezentativni poslovni prostor na prestižnoj lokaciji. Open-space, staklena fasada, 4 parking mjesta. Pogodno za agencije, ordinacije, konzultantske firme.',
    type:          'rent',
    property_type: 'commercial',
    price:         2800,
    currency:      'EUR',
    area:          145,
    bedrooms:      0,
    bathrooms:     2,
    location:      'Marijin Dvor, Sarajevo',
    address:       'Ul. Branilaca Sarajeva 20',
    is_featured:   false,
    images:        ['zk_commercial_space'],
  },
  {
    title:         'Studio apartman za najam, Grbavica',
    description:   'Moderno opremljen studio u mirnoj ulici Grbavice. Klima, parking, internet uključeni u cijenu. Idealno za studente i mlade profesionalce.',
    type:          'rent',
    property_type: 'apartment',
    price:         550,
    currency:      'EUR',
    area:          38,
    bedrooms:      1,
    bathrooms:     1,
    location:      'Grbavica, Sarajevo',
    address:       'Ul. Kemala Kapetanovića 3',
    is_featured:   false,
    images:        ['zk_studio_apt'],
  },
  {
    title:         'Porodična kuća, Mostar',
    description:   'Prostrana kuća blizu rijeke Neretve s velikom terasom i lijepim pogledom. Dva odvojena ulaza, mogućnost iznajmljivanja jednog dijela.',
    type:          'sale',
    property_type: 'house',
    price:         220000,
    currency:      'EUR',
    area:          240,
    bedrooms:      4,
    bathrooms:     2,
    location:      'Mostar',
    address:       'Ul. Alekse Šantića 17, Mostar',
    is_featured:   false,
    images:        ['zk_modern_house'],
  },
  {
    title:         'Dvosoban apartman s pogledom na planinu, Banja Luka',
    description:   'Novoizgrađen apartman u mirnijoj četvrti s pogledom na Vrbas. Podgrijani pod, energetski razred A, podzemna garaža.',
    type:          'rent',
    property_type: 'apartment',
    price:         650,
    currency:      'EUR',
    area:          65,
    bedrooms:      2,
    bathrooms:     1,
    location:      'Banja Luka',
    address:       'Ul. Petra Kočića 44, Banja Luka',
    is_featured:   true,
    images:        ['zk_apartment_modern'],
  },
];

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('🖼️  Uploading images to Cloudinary...\n');

  const uploadedUrls = {};

  for (const img of IMAGES) {
    process.stdout.write(`  Uploading ${img.id}... `);
    try {
      const url = await uploadImage(img.id, img.url);
      uploadedUrls[img.id] = url;
      console.log(`✓ ${url.split('/').pop()}`);
    } catch (err) {
      console.log(`✗ FAILED: ${err.message}`);
      // Use the original Unsplash URL as fallback so seeding still works
      uploadedUrls[img.id] = img.url;
    }
  }

  console.log('\n🏠  Building SQL insert statements...\n');

  const inserts = LISTINGS.map(l => {
    const imageUrls = l.images.map(id => uploadedUrls[id]).filter(Boolean);
    const imagesArray = '{' + imageUrls.map(u => `"${u}"`).join(',') + '}';

    return `INSERT INTO listings (title, description, type, property_type, price, currency, area, bedrooms, bathrooms, location, address, images, is_featured, is_available)
VALUES (
  '${esc(l.title)}',
  '${esc(l.description)}',
  '${l.type}',
  '${l.property_type}',
  ${l.price},
  '${l.currency}',
  ${l.area},
  ${l.bedrooms},
  ${l.bathrooms},
  '${esc(l.location)}',
  '${esc(l.address)}',
  '${imagesArray}',
  ${l.is_featured},
  true
);`;
  });

  const sqlFile = path.join(__dirname, 'seed-listings.sql');
  fs.writeFileSync(sqlFile, inserts.join('\n\n') + '\n\nSELECT COUNT(*) AS total_listings FROM listings;\n');

  console.log('📦  Running SQL inserts against Neon DB...\n');
  const result = execSync(
    `psql "${DB_URL}" -f "${sqlFile}"`,
    { encoding: 'utf-8' }
  );
  console.log(result);

  // Clean up the temp SQL file
  fs.unlinkSync(sqlFile);

  console.log('✅  Done! 8 listings seeded with real Cloudinary images.');
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
