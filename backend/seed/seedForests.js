import mongoose from 'mongoose';
import Forest from '../models/Forest.js';
import { connectDatabase } from '../src/config/database.js';
import { env } from '../src/config/env.js';

// The name/state pair is the stable seed key. Upserts make this script safe to
// run repeatedly without deleting user-created records or creating duplicates.
const forests = [
  {
    name: 'Gir Forest National Park',
    location: 'Sasan Gir',
    state: 'Gujarat',
    district: 'Junagadh',
    latitude: 21.1243,
    longitude: 70.8242,
    area: 1412,
    degradationScore: 18,
    riskLevel: 'Green',
    restorationStatus: 'Healthy',
    damageTypes: ['Water stress'],
    biodiversityStatus: 'Stable lion and dry deciduous habitat',
    description: 'Dry deciduous forest landscape supporting Asiatic lions and diverse native ungulates.',
  },
  {
    name: 'Silent Valley National Park',
    location: 'Mannarkkad',
    state: 'Kerala',
    district: 'Palakkad',
    latitude: 11.0767,
    longitude: 76.4308,
    area: 89.52,
    degradationScore: 24,
    riskLevel: 'Green',
    restorationStatus: 'Healthy',
    damageTypes: ['Invasive species'],
    biodiversityStatus: 'High endemism with intact evergreen canopy',
    description: 'Protected rainforest in the Nilgiri Biosphere Reserve with exceptional endemic biodiversity.',
  },
  {
    name: 'Nagarhole National Park',
    location: 'Kabini',
    state: 'Karnataka',
    district: 'Kodagu',
    latitude: 12.0085,
    longitude: 76.186,
    area: 847.98,
    degradationScore: 32,
    riskLevel: 'Green',
    restorationStatus: 'Recovering',
    damageTypes: ['Human-wildlife conflict', 'Invasive species'],
    biodiversityStatus: 'Rich tiger, elephant, and riparian ecosystem',
    description: 'Western Ghats forest recovering along wildlife corridors near the Kabini reservoir.',
  },
  {
    name: 'Kanha National Park',
    location: 'Kisli Range',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    latitude: 22.334,
    longitude: 80.6115,
    area: 940,
    degradationScore: 38,
    riskLevel: 'Green',
    restorationStatus: 'Recovering',
    damageTypes: ['Fire impact', 'Grazing pressure'],
    biodiversityStatus: 'Recovering hard-ground barasingha habitat',
    description: 'Sal and bamboo forest landscape with active habitat recovery for threatened swamp deer.',
  },
  {
    name: 'Kaziranga Floodplain Forest',
    location: 'Bagori Range',
    state: 'Assam',
    district: 'Nagaon',
    latitude: 26.5775,
    longitude: 93.1711,
    area: 430,
    degradationScore: 44,
    riskLevel: 'Yellow',
    restorationStatus: 'Recovering',
    damageTypes: ['Flood damage', 'Erosion', 'Invasive species'],
    biodiversityStatus: 'Strong megafauna population with pressured wetland edges',
    description: 'Alluvial grassland and woodland mosaic undergoing recovery after repeated flood and erosion events.',
  },
  {
    name: 'Sundarbans Mangrove Reserve',
    location: 'Gosaba Block',
    state: 'West Bengal',
    district: 'South 24 Parganas',
    latitude: 21.9497,
    longitude: 88.8988,
    area: 4260,
    degradationScore: 62,
    riskLevel: 'Yellow',
    restorationStatus: 'Recovering',
    damageTypes: ['Cyclone damage', 'Salinity intrusion', 'Coastal erosion'],
    biodiversityStatus: 'Important tiger and mangrove habitat under coastal stress',
    description: 'Tidal mangrove forest facing salinity and cyclone pressure while community restoration expands.',
  },
  {
    name: 'Buxa Tiger Reserve',
    location: 'Rajabhatkhawa',
    state: 'West Bengal',
    district: 'Alipurduar',
    latitude: 26.7552,
    longitude: 89.583,
    area: 760,
    degradationScore: 66,
    riskLevel: 'Yellow',
    restorationStatus: 'Restoration Initiated',
    damageTypes: ['Forest fragmentation', 'Illegal logging', 'Human disturbance'],
    biodiversityStatus: 'Corridor value remains high but connectivity is fragmented',
    description: 'Eastern Himalayan foothill forest where corridor restoration and community monitoring have begun.',
  },
  {
    name: 'Aravalli Community Forest',
    location: 'Sohna Hills',
    state: 'Haryana',
    district: 'Gurugram',
    latitude: 28.2471,
    longitude: 77.065,
    area: 112,
    degradationScore: 78,
    riskLevel: 'Red',
    restorationStatus: 'Degraded',
    damageTypes: ['Mining', 'Urban expansion', 'Soil degradation'],
    biodiversityStatus: 'Severely fragmented scrub and dry forest habitat',
    description: 'Urban-edge Aravalli forest degraded by quarrying, construction pressure, and soil loss.',
  },
  {
    name: 'Dandeli Anshi Forest',
    location: 'Kali Tiger Reserve',
    state: 'Karnataka',
    district: 'Uttara Kannada',
    latitude: 15.2477,
    longitude: 74.618,
    area: 1300,
    degradationScore: 74,
    riskLevel: 'Red',
    restorationStatus: 'Degraded',
    damageTypes: ['Fire impact', 'Illegal logging', 'Road fragmentation'],
    biodiversityStatus: 'High Western Ghats diversity with stressed hornbill habitat',
    description: 'Moist deciduous and evergreen forest affected by fires, roads, and localized illegal timber extraction.',
  },
  {
    name: 'Similipal Sal Forest',
    location: 'Baripada Range',
    state: 'Odisha',
    district: 'Mayurbhanj',
    latitude: 21.593,
    longitude: 86.364,
    area: 2750,
    degradationScore: 72,
    riskLevel: 'Red',
    restorationStatus: 'Restoration Initiated',
    damageTypes: ['Fire impact', 'Illegal logging', 'Human disturbance'],
    biodiversityStatus: 'Tiger and elephant habitat requiring fire management support',
    description: 'Large sal forest landscape with active fire-management and habitat restoration interventions.',
  },
  {
    name: 'Great Himalayan Alpine Forest',
    location: 'Tirthan Valley',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    latitude: 31.704,
    longitude: 77.457,
    area: 754.4,
    degradationScore: 55,
    riskLevel: 'Yellow',
    restorationStatus: 'Restoration Initiated',
    damageTypes: ['Climate stress', 'Tourism pressure', 'Landslides'],
    biodiversityStatus: 'Alpine species remain present with shrinking suitable habitat',
    description: 'Mountain forest and alpine transition zone where climate and visitor pressure affect habitat quality.',
  },
  {
    name: 'Nallamala Dry Forest',
    location: 'Srisailam Buffer',
    state: 'Andhra Pradesh',
    district: 'Nandyal',
    latitude: 16.047,
    longitude: 78.868,
    area: 1200,
    degradationScore: 86,
    riskLevel: 'Red',
    restorationStatus: 'Degraded',
    damageTypes: ['Drought', 'Fire impact', 'Grazing pressure', 'Soil degradation'],
    biodiversityStatus: 'Fragmented dry forest with declining prey and water availability',
    description: 'Dry deciduous forest under severe drought, grazing, and recurring fire pressure in the Eastern Ghats.',
  },
];

async function seedForests() {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI must be configured before running the forest seed');
  }

  const connected = await connectDatabase(env.mongoUri);
  if (!connected) {
    throw new Error('Unable to connect to MongoDB');
  }

  const operations = forests.map((forest) => ({
    updateOne: {
      filter: { name: forest.name, state: forest.state },
      update: { $set: forest },
      upsert: true,
    },
  }));

  const result = await Forest.bulkWrite(operations, { ordered: false });

  console.log(`Forest seed complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`);
}

try {
  await seedForests();
} catch (error) {
  console.error(`Forest seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}