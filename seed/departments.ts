import {
  Department,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedDepartments() {
  const countries = await prisma.country.findMany();
  let departments: Department[] = [];

  const departmentsData = [
    { name: 'Ain', code: '01', latitude: 46.1333, longitude: 5.35, countryCode: 'FR' },
    { name: 'Aisne', code: '02', latitude: 49.5602, longitude: 3.4906, countryCode: 'FR' },
    { name: 'Allier', code: '03', latitude: 46.1227, longitude: 3.4267, countryCode: 'FR' },
    { name: 'Alpes-de-Haute-Provence', code: '04', latitude: 44.0562, longitude: 6.2435, countryCode: 'FR' },
    { name: 'Hautes-Alpes', code: '05', latitude: 44.5596, longitude: 6.0803, countryCode: 'FR' },
    { name: 'Alpes-Maritimes', code: '06', latitude: 43.8954, longitude: 7.179, countryCode: 'FR' },
    { name: 'Ardèche', code: '07', latitude: 44.7508, longitude: 4.5895, countryCode: 'FR' },
    { name: 'Ardennes', code: '08', latitude: 49.7617, longitude: 4.7086, countryCode: 'FR' },
    { name: 'Ariège', code: '09', latitude: 42.9466, longitude: 1.606, countryCode: 'FR' },
    { name: 'Aube', code: '10', latitude: 48.293, longitude: 4.0795, countryCode: 'FR' },
    { name: 'Aude', code: '11', latitude: 43.0621, longitude: 2.3627, countryCode: 'FR' },
    { name: 'Aveyron', code: '12', latitude: 44.35, longitude: 2.5667, countryCode: 'FR' },
    { name: 'Bouches-du-Rhône', code: '13', latitude: 43.2965, longitude: 5.3698, countryCode: 'FR' },
    { name: 'Calvados', code: '14', latitude: 49.181, longitude: -0.3716, countryCode: 'FR' },
    { name: 'Cantal', code: '15', latitude: 45.03, longitude: 2.5215, countryCode: 'FR' },
    { name: 'Charente', code: '16', latitude: 45.6484, longitude: 0.1597, countryCode: 'FR' },
    { name: 'Charente-Maritime', code: '17', latitude: 45.9997, longitude: -0.9828, countryCode: 'FR' },
    { name: 'Cher', code: '18', latitude: 47.0656, longitude: 2.3958, countryCode: 'FR' },
    { name: 'Corrèze', code: '19', latitude: 45.2669, longitude: 1.7732, countryCode: 'FR' },
    { name: "Corse-du-Sud", code: '2A', latitude: 41.9186, longitude: 8.7386, countryCode: 'FR' },
    { name: "Haute-Corse", code: '2B', latitude: 42.2667, longitude: 9.1667, countryCode: 'FR' },
    { name: 'Côte-d\'Or', code: '21', latitude: 47.322, longitude: 5.0415, countryCode: 'FR' },
    { name: "Côtes-d'Armor", code: '22', latitude: 48.5139, longitude: -2.7683, countryCode: 'FR' },
    { name: 'Creuse', code: '23', latitude: 46.1756, longitude: 1.8787, countryCode: 'FR' },
    { name: 'Dordogne', code: '24', latitude: 45.184, longitude: 0.7212, countryCode: 'FR' },
    { name: 'Doubs', code: '25', latitude: 47.251, longitude: 6.0228, countryCode: 'FR' },
    { name: 'Drôme', code: '26', latitude: 44.7108, longitude: 4.8996, countryCode: 'FR' },
    { name: 'Eure', code: '27', latitude: 49.0935, longitude: 1.1483, countryCode: 'FR' },
    { name: 'Eure-et-Loir', code: '28', latitude: 48.4465, longitude: 1.4894, countryCode: 'FR' },
    { name: 'Finistère', code: '29', latitude: 48.4475, longitude: -4.2081, countryCode: 'FR' },
    { name: 'Gard', code: '30', latitude: 43.8367, longitude: 4.3572, countryCode: 'FR' },
    { name: 'Haute-Garonne', code: '31', latitude: 43.6047, longitude: 1.4442, countryCode: 'FR' },
    { name: 'Gers', code: '32', latitude: 43.654, longitude: 0.585, countryCode: 'FR' },
    { name: 'Gironde', code: '33', latitude: 44.8378, longitude: -0.5792, countryCode: 'FR' },
    { name: 'Hérault', code: '34', latitude: 43.6119, longitude: 3.877, countryCode: 'FR' },
    { name: 'Ille-et-Vilaine', code: '35', latitude: 48.1173, longitude: -1.6778, countryCode: 'FR' },
    { name: 'Indre', code: '36', latitude: 46.7641, longitude: 1.6939, countryCode: 'FR' },
    { name: 'Indre-et-Loire', code: '37', latitude: 47.3941, longitude: 0.6848, countryCode: 'FR' },
    { name: 'Isère', code: '38', latitude: 45.1876, longitude: 5.7359, countryCode: 'FR' },
    { name: 'Jura', code: '39', latitude: 46.6761, longitude: 5.551, countryCode: 'FR' },
    { name: 'Landes', code: '40', latitude: 43.9455, longitude: -0.7558, countryCode: 'FR' },
    { name: 'Loir-et-Cher', code: '41', latitude: 47.5861, longitude: 1.335, countryCode: 'FR' },
    { name: 'Loire', code: '42', latitude: 45.4339, longitude: 4.39, countryCode: 'FR' },
    { name: 'Loire-Atlantique', code: '44', latitude: 47.3482, longitude: -1.8727, countryCode: 'FR' },
    { name: 'Loiret', code: '45', latitude: 47.9029, longitude: 1.9044, countryCode: 'FR' },
    { name: 'Lot', code: '46', latitude: 44.6112, longitude: 1.6156, countryCode: 'FR' },
    { name: 'Lot-et-Garonne', code: '47', latitude: 44.3401, longitude: 0.6503, countryCode: 'FR' },
    { name: 'Lozère', code: '48', latitude: 44.5191, longitude: 3.4998, countryCode: 'FR' },
    { name: 'Maine-et-Loire', code: '49', latitude: 47.4736, longitude: -0.5556, countryCode: 'FR' },
    { name: 'Manche', code: '50', latitude: 49.0822, longitude: -1.3986, countryCode: 'FR' },
    { name: 'Marne', code: '51', latitude: 49.0491, longitude: 4.0257, countryCode: 'FR' },
    { name: 'Haute-Marne', code: '52', latitude: 48.1221, longitude: 5.3468, countryCode: 'FR' },
    { name: 'Mayenne', code: '53', latitude: 48.3033, longitude: -0.6134, countryCode: 'FR' },
    { name: 'Meurthe-et-Moselle', code: '54', latitude: 48.6921, longitude: 6.1834, countryCode: 'FR' },
    { name: 'Meuse', code: '55', latitude: 49.0829, longitude: 5.2611, countryCode: 'FR' },
    { name: 'Morbihan', code: '56', latitude: 47.806, longitude: -2.9371, countryCode: 'FR' },
    { name: 'Moselle', code: '57', latitude: 49.1193, longitude: 6.1757, countryCode: 'FR' },
    { name: 'Nièvre', code: '58', latitude: 47.0192, longitude: 3.1336, countryCode: 'FR' },
    { name: 'Nord', code: '59', latitude: 50.6292, longitude: 3.0573, countryCode: 'FR' },
    { name: 'Oise', code: '60', latitude: 49.4183, longitude: 2.8262, countryCode: 'FR' },
    { name: 'Orne', code: '61', latitude: 48.6103, longitude: 0.0772, countryCode: 'FR' },
    { name: 'Pas-de-Calais', code: '62', latitude: 50.4257, longitude: 2.8303, countryCode: 'FR' },
    { name: 'Puy-de-Dôme', code: '63', latitude: 45.7772, longitude: 3.0829, countryCode: 'FR' },
    { name: 'Pyrénées-Atlantiques', code: '64', latitude: 43.2951, longitude: -0.3708, countryCode: 'FR' },
    { name: 'Hautes-Pyrénées', code: '65', latitude: 43.1167, longitude: 0.05, countryCode: 'FR' },
    { name: 'Pyrénées-Orientales', code: '66', latitude: 42.6887, longitude: 2.8948, countryCode: 'FR' },
    { name: 'Bas-Rhin', code: '67', latitude: 48.5839, longitude: 7.7455, countryCode: 'FR' },
    { name: 'Haut-Rhin', code: '68', latitude: 47.8107, longitude: 7.3359, countryCode: 'FR' },
    { name: 'Rhône', code: '69', latitude: 45.75, longitude: 4.85, countryCode: 'FR' },
    { name: 'Haute-Saône', code: '70', latitude: 47.6374, longitude: 6.8607, countryCode: 'FR' },
    { name: 'Saône-et-Loire', code: '71', latitude: 46.5653, longitude: 4.6791, countryCode: 'FR' },
    { name: 'Sarthe', code: '72', latitude: 48.0077, longitude: 0.1996, countryCode: 'FR' },
    { name: 'Savoie', code: '73', latitude: 45.5613, longitude: 5.9155, countryCode: 'FR' },
    { name: 'Haute-Savoie', code: '74', latitude: 45.8992, longitude: 6.1294, countryCode: 'FR' },
    { name: 'Paris', code: '75', latitude: 48.8588897, longitude: 2.320041, countryCode: 'FR' },
    { name: 'Seine-Maritime', code: '76', latitude: 49.4431, longitude: 1.0993, countryCode: 'FR' },
    { name: 'Seine-et-Marne', code: '77', latitude: 48.5342, longitude: 2.6575, countryCode: 'FR' },
    { name: 'Yvelines', code: '78', latitude: 48.8131, longitude: 1.9933, countryCode: 'FR' },
    { name: 'Deux-Sèvres', code: '79', latitude: 46.3242, longitude: -0.4546, countryCode: 'FR' },
    { name: 'Somme', code: '80', latitude: 49.8974, longitude: 2.3023, countryCode: 'FR' },
    { name: 'Tarn', code: '81', latitude: 43.7101, longitude: 2.1479, countryCode: 'FR' },
    { name: 'Tarn-et-Garonne', code: '82', latitude: 44.0162, longitude: 1.3542, countryCode: 'FR' },
    { name: 'Var', code: '83', latitude: 43.4619, longitude: 6.0467, countryCode: 'FR' },
    { name: 'Vaucluse', code: '84', latitude: 44.0438, longitude: 4.809, countryCode: 'FR' },
    { name: 'Vendée', code: '85', latitude: 46.6706, longitude: -1.4267, countryCode: 'FR' },
    { name: 'Vienne', code: '86', latitude: 46.5833, longitude: 0.35, countryCode: 'FR' },
    { name: 'Haute-Vienne', code: '87', latitude: 45.8336, longitude: 1.2611, countryCode: 'FR' },
    { name: 'Vosges', code: '88', latitude: 48.1737, longitude: 6.4487, countryCode: 'FR' },
    { name: 'Yonne', code: '89', latitude: 47.8517, longitude: 3.5105, countryCode: 'FR' },
    { name: 'Territoire de Belfort', code: '90', latitude: 47.6391, longitude: 6.8632, countryCode: 'FR' },
    { name: 'Essonne', code: '91', latitude: 48.529, longitude: 2.3488, countryCode: 'FR' },
    { name: 'Hauts-de-Seine', code: '92', latitude: 48.847, longitude: 2.2113, countryCode: 'FR' },
    { name: 'Seine-Saint-Denis', code: '93', latitude: 48.909, longitude: 2.4006, countryCode: 'FR' },
    { name: 'Val-de-Marne', code: '94', latitude: 48.7926, longitude: 2.4755, countryCode: 'FR' },
    { name: "Val-d'Oise", code: '95', latitude: 49.046, longitude: 2.2097, countryCode: 'FR' }
  ]

  for (const departmentData of departmentsData) {
    const country = countries.find((c) => c.code === departmentData.countryCode);
    if (country) {
      departments.push(
        await prisma.department.upsert({
          where: {
            code_countryId: {
              code: departmentData.code,
              countryId: country.id,
            },
          },
          update: {},
          create: {
            name: departmentData.name,
            code: departmentData.code,
            countryId: country.id,
            latitude: departmentData.latitude,
            longitude: departmentData.longitude,
          },
        })
      );
    }
  }

  return departments
}