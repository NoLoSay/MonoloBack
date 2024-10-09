import {
  City,
  Country,
  Department,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

async function loopCities(citiesList: any[], departments: Department[]) {
  let cities: City[] = [];

  for (const cityData of citiesList) {
    const department = departments.find((d) => (d.code === cityData.departmentCode));
    if (!department) {
      break;
    }
    cities.push(
      await prisma.city.upsert({
        where: { name_departmentId: {
          name: cityData.name,
          departmentId: department.id,
          } },
        update: {},
        create: {
          name: cityData.name,
          latitude: cityData.latitude,
          longitude: cityData.longitude,
          zip: cityData.zip,
          department: {
            connect: {
              id: department.id,
            },
          },
        },
      })
    );
  }
  return cities;
}

export async function seedCities() {
  const departments = await prisma.department.findMany();

  let cities: City[] = [];
  const frenchCitiesPrefecture = [
    { name: 'Agen', departmentCode: '47', zip: '47000', latitude: 44.2049, longitude: 0.6201 },
    { name: 'Aix-en-Provence', departmentCode: '13', zip: '13100', latitude: 43.5297, longitude: 5.4474 },
    { name: 'Ajaccio', departmentCode: '2A', zip: '20000', latitude: 41.9192, longitude: 8.7386 },
    { name: 'Albi', departmentCode: '81', zip: '81000', latitude: 43.929, longitude: 2.148 },
    { name: 'Amiens', departmentCode: '80', zip: '80000', latitude: 49.8941, longitude: 2.2957 },
    { name: 'Angers', departmentCode: '49', zip: '49000', latitude: 47.4784, longitude: -0.5632 },
    { name: 'Annecy', departmentCode: '74', zip: '74000', latitude: 45.8992, longitude: 6.1294 },
    { name: 'Arras', departmentCode: '62', zip: '62000', latitude: 50.293, longitude: 2.7774 },
    { name: 'Aurillac', departmentCode: '15', zip: '15000', latitude: 44.9221, longitude: 2.4404 },
    { name: 'Auxerre', departmentCode: '89', zip: '89000', latitude: 47.7982, longitude: 3.5731 },
    { name: 'Avignon', departmentCode: '84', zip: '84000', latitude: 43.9493, longitude: 4.8055 },
    { name: 'Bar-le-Duc', departmentCode: '55', zip: '55000', latitude: 48.7739, longitude: 5.1618 },
    { name: 'Bastia', departmentCode: '2B', zip: '20200', latitude: 42.6973, longitude: 9.4509 },
    { name: 'Bayonne', departmentCode: '64', zip: '64100', latitude: 43.4929, longitude: -1.4748 },
    { name: 'Beauvais', departmentCode: '60', zip: '60000', latitude: 49.4305, longitude: 2.0864 },
    { name: 'Besançon', departmentCode: '25', zip: '25000', latitude: 47.2378, longitude: 6.0241 },
    { name: 'Blois', departmentCode: '41', zip: '41000', latitude: 47.5861, longitude: 1.3356 },
    { name: 'Bobigny', departmentCode: '93', zip: '93000', latitude: 48.906, longitude: 2.4333 },
    { name: 'Bordeaux', departmentCode: '33', zip: '33000', latitude: 44.8378, longitude: -0.5792 },
    { name: 'Bourges', departmentCode: '18', zip: '18000', latitude: 47.081, longitude: 2.398 },
    { name: 'Brest', departmentCode: '29', zip: '29200', latitude: 48.3904, longitude: -4.4861 },
    { name: 'Brive-la-Gaillarde', departmentCode: '19', zip: '19100', latitude: 45.1576, longitude: 1.5339 },
    { name: 'Caen', departmentCode: '14', zip: '14000', latitude: 49.1829, longitude: -0.3707 },
    { name: 'Cahors', departmentCode: '46', zip: '46000', latitude: 44.4479, longitude: 1.4419 },
    { name: 'Carcassonne', departmentCode: '11', zip: '11000', latitude: 43.213, longitude: 2.351 },
    { name: 'Châlons-en-Champagne', departmentCode: '51', zip: '51000', latitude: 48.9569, longitude: 4.3673 },
    { name: 'Chambéry', departmentCode: '73', zip: '73000', latitude: 45.5646, longitude: 5.9178 },
    { name: 'Charleville-Mézières', departmentCode: '08', zip: '08000', latitude: 49.7758, longitude: 4.7205 },
    { name: 'Chartres', departmentCode: '28', zip: '28000', latitude: 48.4468, longitude: 1.4893 },
    { name: 'Clermont-Ferrand', departmentCode: '63', zip: '63000', latitude: 45.7772, longitude: 3.0829 },
    { name: 'Colmar', departmentCode: '68', zip: '68000', latitude: 48.0805, longitude: 7.3556 },
    { name: 'Créteil', departmentCode: '94', zip: '94000', latitude: 48.7833, longitude: 2.4667 },
    { name: 'Digne-les-Bains', departmentCode: '04', zip: '04000', latitude: 44.0922, longitude: 6.2331 },
    { name: 'Dijon', departmentCode: '21', zip: '21000', latitude: 47.322, longitude: 5.0415 },
    { name: 'Épinal', departmentCode: '88', zip: '88000', latitude: 48.1734, longitude: 6.4495 },
    { name: 'Evreux', departmentCode: '27', zip: '27000', latitude: 49.0236, longitude: 1.1506 },
    { name: 'Foix', departmentCode: '09', zip: '09000', latitude: 42.9673, longitude: 1.6051 },
    { name: 'Gap', departmentCode: '05', zip: '05000', latitude: 44.5598, longitude: 6.0794 },
    { name: 'Grenoble', departmentCode: '38', zip: '38000', latitude: 45.1885, longitude: 5.7245 },
    { name: 'Guéret', departmentCode: '23', zip: '23000', latitude: 46.1703, longitude: 1.868 },
    { name: 'Laon', departmentCode: '02', zip: '02000', latitude: 49.5635, longitude: 3.6242 },
    { name: 'Le Mans', departmentCode: '72', zip: '72000', latitude: 48.0077, longitude: 0.1996 },
    { name: 'Lille', departmentCode: '59', zip: '59000', latitude: 50.6292, longitude: 3.0573 },
    { name: 'Limoges', departmentCode: '87', zip: '87000', latitude: 45.8336, longitude: 1.2611 },
    { name: 'Lyon', departmentCode: '69', zip: '69000', latitude: 45.75, longitude: 4.85 },
    { name: 'Mâcon', departmentCode: '71', zip: '71000', latitude: 46.3043, longitude: 4.8286 },
    { name: 'Marseille', departmentCode: '13', zip: '13000', latitude: 43.2965, longitude: 5.3698 },
    { name: 'Melun', departmentCode: '77', zip: '77000', latitude: 48.5402, longitude: 2.6604 },
    { name: 'Metz', departmentCode: '57', zip: '57000', latitude: 49.1193, longitude: 6.1757 },
    { name: 'Mont-de-Marsan', departmentCode: '40', zip: '40000', latitude: 43.8938, longitude: -0.5005 },
    { name: 'Montpellier', departmentCode: '34', zip: '34000', latitude: 43.6119, longitude: 3.8772 },
    { name: 'Moulins', departmentCode: '03', zip: '03000', latitude: 46.5652, longitude: 3.3349 },
    { name: 'Nancy', departmentCode: '54', zip: '54000', latitude: 48.6921, longitude: 6.1844 },
    { name: 'Nanterre', departmentCode: '92', zip: '92000', latitude: 48.8925, longitude: 2.2068 },
    { name: 'Nantes', departmentCode: '44', zip: '44000', latitude: 47.2184, longitude: -1.5536 },
    { name: 'Nevers', departmentCode: '58', zip: '58000', latitude: 46.9896, longitude: 3.1628 },
    { name: 'Nice', departmentCode: '06', zip: '06000', latitude: 43.7102, longitude: 7.262 },
    { name: 'Nîmes', departmentCode: '30', zip: '30000', latitude: 43.8367, longitude: 4.3601 },
    { name: 'Orléans', departmentCode: '45', zip: '45000', latitude: 47.9029, longitude: 1.9093 },
    { name: 'Paris', departmentCode: '75', zip: '75000', latitude: 48.8566, longitude: 2.3522 },
    { name: 'Perpignan', departmentCode: '66', zip: '66000', latitude: 42.6887, longitude: 2.8948 },
    { name: 'Poitiers', departmentCode: '86', zip: '86000', latitude: 46.5802, longitude: 0.3404 },
    { name: 'Quimper', departmentCode: '29', zip: '29000', latitude: 48.0003, longitude: -4.0985 },
    { name: 'Rennes', departmentCode: '35', zip: '35000', latitude: 48.1173, longitude: -1.6778 },
    { name: 'Reims', departmentCode: '51', zip: '51100', latitude: 49.2583, longitude: 4.0317 },
    { name: 'Rouen', departmentCode: '76', zip: '76000', latitude: 49.4432, longitude: 1.0999 },
    { name: 'Saint-Brieuc', departmentCode: '22', zip: '22000', latitude: 48.5139, longitude: -2.7656 },
    { name: 'Strasbourg', departmentCode: '67', zip: '67000', latitude: 48.5734, longitude: 7.7521 },
    { name: 'Toulon', departmentCode: '83', zip: '83000', latitude: 43.1242, longitude: 5.928 },
    { name: 'Toulouse', departmentCode: '31', zip: '31000', latitude: 43.6047, longitude: 1.4442 },
    { name: 'Tours', departmentCode: '37', zip: '37000', latitude: 47.3941, longitude: 0.6848 },
    { name: 'Troyes', departmentCode: '10', zip: '10000', latitude: 48.2973, longitude: 4.0744 },
    { name: 'Valence', departmentCode: '26', zip: '26000', latitude: 44.9334, longitude: 4.8924 },
    { name: 'Vannes', departmentCode: '56', zip: '56000', latitude: 47.658, longitude: -2.7607 },
    { name: 'Versailles', departmentCode: '78', zip: '78000', latitude: 48.8014, longitude: 2.1301 }
  ];

  const belgianCitiesPrefecture = [
    { name: 'Bruxelles', departmentCode: 'BRU', zip: '1000', latitude: 50.8467, longitude: 4.3499 },
    { name: 'Liège', departmentCode: 'WLG', zip: '4000', latitude: 50.6337, longitude: 5.566 },
    { name: 'Anvers', departmentCode: 'VAN', zip: '2000', latitude: 51.2194, longitude: 4.4025 },
    { name: 'Gand', departmentCode: 'VOV', zip: '9000', latitude: 51.0543, longitude: 3.7174 },
    { name: 'Namur', departmentCode: 'WNA', zip: '5000', latitude: 50.4674, longitude: 4.8719 },
    { name: 'Charleroi', departmentCode: 'WHT', zip: '6000', latitude: 50.4114, longitude: 4.4447 },
    { name: 'Mons', departmentCode: 'WHT', zip: '7000', latitude: 50.4541, longitude: 3.9523 },
    { name: 'Bruges', departmentCode: 'VWV', zip: '8000', latitude: 51.2093, longitude: 3.2247 }
  ];

  cities = cities.concat(await loopCities(frenchCitiesPrefecture, departments));
  cities = cities.concat(await loopCities(belgianCitiesPrefecture, departments));

  return cities;
}
