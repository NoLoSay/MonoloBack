import {
  Address,
  City,
  Country,
  Department,
  PrismaClient as PrismaBaseClient,
  SiteTag,
  SiteType,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

interface SiteData {
  address: {
    houseNumber: string;
    street: string;
    zip: string;
    cityName: string; // Nom de la ville pour retrouver l'ID
    longitude: number;
    latitude: number;
  };
  site: {
    name: string;
    price: number;
    type: SiteType;
    tags: SiteTag[];
    email: string;
    telNumber: string;
    website: string;
    shortDescription: string;
    longDescription: string;
  };
}

const sitesData: SiteData[] = [
  {
    address: {
      houseNumber: "4",
      street: "Place Marc Élan",
      zip: "44000",
      cityName: "Nantes",
      longitude: -1.5569,
      latitude: 47.2166
    },
    site: {
      name: "Château des Ducs de Bretagne",
      price: 8.0,
      type: "CASTLE",
      tags: [SiteTag.NOLOSAY, SiteTag.DISABILITY_FRIENDLY],
      email: "contact@chateaunantes.fr",
      telNumber: "02 40 41 50 00",
      website: "https://www.chateaunantes.fr/",
      shortDescription: "Château historique de la ville de Nantes.",
      longDescription: "Le Château des Ducs de Bretagne est un monument emblématique de Nantes, offrant une plongée dans l'histoire de la Bretagne à travers ses expositions et son architecture médiévale."
    }
  },
  {
    address: {
      houseNumber: "2",
      street: "Place de la Lice",
      zip: "49000",
      cityName: "Angers",
      longitude: -0.5575,
      latitude: 47.4725
    },
    site: {
      name: "Château d'Angers",
      price: 9.5,
      type: "CASTLE",
      tags: [SiteTag.NOLOSAY],
      email: "contact@chateaudangers.fr",
      telNumber: "02 41 87 20 00",
      website: "https://www.chateau-angers.fr/",
      shortDescription: "Monument historique avec des jardins et une tapisserie célèbre.",
      longDescription: "Le Château d'Angers, célèbre pour sa grande tapisserie de l'Apocalypse, est un exemple impressionnant d'architecture médiévale, entouré de jardins et offrant une vue magnifique sur la ville."
    }
  },
  {
    address: {
      houseNumber: "10",
      street: "Rue des Petits Champs",
      zip: "75001",
      cityName: "Paris",
      longitude: 2.3320,
      latitude: 48.8619
    },
    site: {
      name: "Musée du Louvre",
      price: 17.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY, SiteTag.DISABILITY_FRIENDLY],
      email: "info@louvre.fr",
      telNumber: "01 40 20 50 50",
      website: "https://www.louvre.fr/",
      shortDescription: "Musée d'art et d'histoire avec des œuvres emblématiques.",
      longDescription: "Le Musée du Louvre est l'un des plus grands musées d'art au monde, abritant des milliers d'œuvres célèbres, dont la Mona Lisa et la Vénus de Milo."
    }
  },
  {
    address: {
      houseNumber: "1",
      street: "Rue des Rivoli",
      zip: "75004",
      cityName: "Paris",
      longitude: 2.3450,
      latitude: 48.8609
    },
    site: {
      name: "Centre Pompidou",
      price: 14.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY],
      email: "info@centrepompidou.fr",
      telNumber: "01 44 78 12 33",
      website: "https://www.centrepompidou.fr/",
      shortDescription: "Centre d'art moderne et contemporain.",
      longDescription: "Le Centre Pompidou est un haut lieu de l'art moderne, avec une vaste collection d'œuvres d'art contemporaines et une bibliothèque publique."
    }
  },
  {
    address: {
      houseNumber: "18",
      street: "Place de l'Opéra",
      zip: "75002",
      cityName: "Paris",
      longitude: 2.3328,
      latitude: 48.8718
    },
    site: {
      name: "Palais Garnier",
      price: 12.0,
      type: "MONUMENT",
      tags: [SiteTag.DISABILITY_FRIENDLY, SiteTag.BLIND_FRIENDLY],
      email: "",
      telNumber: "01 71 25 24 23",
      website: "https://www.operadeparis.fr/",
      shortDescription: "Opéra historique de Paris avec une architecture grandiose.",
      longDescription: "Le Palais Garnier est un chef-d'œuvre de l'architecture du XIXe siècle, célèbre pour sa salle de spectacle luxueuse et ses sculptures."
    }
  },
  {
    address: {
      houseNumber: "1",
      street: "Avenue du Général Eisenhower",
      zip: "49000",
      cityName: "Angers",
      longitude: -0.5528,
      latitude: 47.4706
    },
    site: {
      name: "Musée des Beaux-Arts d'Angers",
      price: 8.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY, SiteTag.OTHER],
      email: "",
      telNumber: "02 41 24 17 57",
      website: "https://musee.angers.fr/",
      shortDescription: "Collection d'art européen du Moyen Âge à nos jours.",
      longDescription: "Le Musée des Beaux-Arts d'Angers présente une riche collection d'œuvres d'art allant du Moyen Âge au XXe siècle, dans un cadre élégant."
    }
  },
  {
    address: {
      houseNumber: "15",
      street: "Rue de l'École de Médecine",
      zip: "75006",
      cityName: "Paris",
      longitude: 2.3390,
      latitude: 48.8428
    },
    site: {
      name: "Musée de l'Histoire de la Médecine",
      price: 0.0,
      type: "MUSEUM",
      tags: [SiteTag.DEAF_FRIENDLY, SiteTag.OTHER],
      email: "",
      telNumber: "01 43 29 48 76",
      website: "http://www.musee-histoire-medicine.fr/",
      shortDescription: "Musée dédié à l'histoire de la médecine.",
      longDescription: "Le musée offre un aperçu fascinant des pratiques médicales à travers les âges, avec une collection d'instruments anciens et de livres."
    }
  },
  {
    address: {
      houseNumber: "8",
      street: "Place de la Bourse",
      zip: "44000",
      cityName: "Nantes",
      longitude: -1.5549,
      latitude: 47.2172
    },
    site: {
      name: "Musée d'Arts de Nantes",
      price: 7.0,
      type: "MUSEUM",
      tags: [SiteTag.BLIND_FRIENDLY],
      email: "",
      telNumber: "02 51 17 45 00",
      website: "https://museedarts.nantes.fr/",
      shortDescription: "Collection d'œuvres d'art européen.",
      longDescription: "Le Musée d'Arts de Nantes présente une riche collection d'œuvres d'art, allant de la Renaissance à l'art moderne, dans un cadre élégant."
    }
  },
  {
    address: {
      houseNumber: "3",
      street: "Place de la Concorde",
      zip: "75008",
      cityName: "Paris",
      longitude: 2.3213,
      latitude: 48.8656
    },
    site: {
      name: "Musée de l'Orangerie",
      price: 9.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY, SiteTag.OTHER],
      email: "",
      telNumber: "01 44 50 43 00",
      website: "https://www.musee-orangerie.fr/",
      shortDescription: "Musée d'art impressionniste et moderne.",
      longDescription: "Le Musée de l'Orangerie est célèbre pour ses Nymphéas de Monet et abrite une collection exceptionnelle d'œuvres impressionnistes."
    }
  },
  {
    address: {
      houseNumber: "4",
      street: "Place du Palais Royal",
      zip: "75001",
      cityName: "Paris",
      longitude: 2.3347,
      latitude: 48.8660
    },
    site: {
      name: "Palais Royal",
      price: 0.0,
      type: "GARDEN",
      tags: [SiteTag.DISABILITY_FRIENDLY, SiteTag.BLIND_FRIENDLY],
      email: "",
      telNumber: "",
      website: "https://www.paris.fr/equipements/palais-royal-1540",
      shortDescription: "Jardins et arcades historiques.",
      longDescription: "Le Palais Royal est un lieu de détente avec ses magnifiques jardins, entouré d'arcades et de galeries, offrant un aperçu de l'histoire de France."
    }
  },
  {
    address: {
      houseNumber: "15",
      street: "Rue du Faubourg Saint-Antoine",
      zip: "75011",
      cityName: "Paris",
      longitude: 2.3770,
      latitude: 48.8556
    },
    site: {
      name: "Musée des Arts et Métiers",
      price: 8.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY, SiteTag.OTHER],
      email: "",
      telNumber: "01 53 01 82 00",
      website: "https://www.arts-et-metiers.net/",
      shortDescription: "Musée dédié aux inventions et aux sciences.",
      longDescription: "Le Musée des Arts et Métiers présente l'histoire de la technologie et des sciences à travers des expositions d'objets historiques et contemporains."
    }
  },
  {
    address: {
      houseNumber: "6",
      street: "Avenue de la Grande Armée",
      zip: "75017",
      cityName: "Paris",
      longitude: 2.2887,
      latitude: 48.8738
    },
    site: {
      name: "Musée Marmottan Monet",
      price: 12.0,
      type: "MUSEUM",
      tags: [SiteTag.BLIND_FRIENDLY],
      email: "",
      telNumber: "01 44 96 50 00",
      website: "https://marmottan.fr/",
      shortDescription: "Musée dédié à Claude Monet et à l'impressionnisme.",
      longDescription: "Le Musée Marmottan Monet abrite la plus grande collection d'œuvres de Monet, ainsi que d'autres artistes impressionnistes."
    }
  },
  {
    address: {
      houseNumber: "17",
      street: "Rue de la Pomme",
      zip: "44000",
      cityName: "Nantes",
      longitude: -1.5585,
      latitude: 47.2176
    },
    site: {
      name: "Musée de l'Histoire de Nantes",
      price: 6.0,
      type: "MUSEUM",
      tags: [SiteTag.DISABILITY_FRIENDLY],
      email: "",
      telNumber: "02 40 41 50 00",
      website: "https://www.chateaunantes.fr/musee/",
      shortDescription: "Musée d'histoire locale.",
      longDescription: "Ce musée offre une vue d'ensemble de l'histoire de Nantes, de la période gallo-romaine à nos jours, avec des expositions interactives."
    }
  },
  {
    address: {
      houseNumber: "23",
      street: "Rue de l'Université",
      zip: "75007",
      cityName: "Paris",
      longitude: 2.3245,
      latitude: 48.8576
    },
    site: {
      name: "Musée Rodin",
      price: 12.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY, SiteTag.OTHER],
      email: "",
      telNumber: "01 44 18 61 10",
      website: "https://www.musee-rodin.fr/",
      shortDescription: "Musée dédié à l'œuvre d'Auguste Rodin.",
      longDescription: "Le Musée Rodin présente les sculptures, dessins et objets d'Auguste Rodin, ainsi que des jardins magnifiques."
    }
  },
  {
    address: {
      houseNumber: "29",
      street: "Rue du Musée",
      zip: "75007",
      cityName: "Paris",
      longitude: 2.3251,
      latitude: 48.8616
    },
    site: {
      name: "Musée de l'Armée",
      price: 14.0,
      type: "MUSEUM",
      tags: [SiteTag.DEAF_FRIENDLY, SiteTag.BLIND_FRIENDLY],
      email: "",
      telNumber: "01 44 42 38 77",
      website: "https://www.musee-armee.fr/",
      shortDescription: "Musée d'histoire militaire.",
      longDescription: "Le Musée de l'Armée est l'un des plus grands musées d'histoire militaire, abritant des collections d'armures, d'armes et de véhicules militaires."
    }
  },
  {
    address: {
      houseNumber: "34",
      street: "Avenue de la Bourdonnais",
      zip: "75007",
      cityName: "Paris",
      longitude: 2.2950,
      latitude: 48.8553
    },
    site: {
      name: "Musée du quai Branly",
      price: 10.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY],
      email: "",
      telNumber: "01 56 61 70 00",
      website: "https://www.quaibranly.fr/",
      shortDescription: "Musée des arts et civilisations d'Afrique, d'Asie, d'Océanie et des Amériques.",
      longDescription: "Le Musée du quai Branly présente des collections d'arts non occidentaux dans un cadre architectural unique, entouré de jardins luxuriants."
    }
  },
  {
    address: {
      houseNumber: "17",
      street: "Rue de la Paix",
      zip: "75002",
      cityName: "Paris",
      longitude: 2.3327,
      latitude: 48.8674
    },
    site: {
      name: "Musée des Arts Décoratifs",
      price: 12.0,
      type: "MUSEUM",
      tags: [SiteTag.BLIND_FRIENDLY],
      email: "",
      telNumber: "01 44 55 57 00",
      website: "https://madparis.fr/",
      shortDescription: "Musée des arts décoratifs et du design.",
      longDescription: "Le Musée des Arts Décoratifs présente des collections d'objets d'art, de design et de mode à travers les siècles."
    }
  },
  {
    address: {
      houseNumber: "20",
      street: "Rue des Frères Lumière",
      zip: "69008",
      cityName: "Lyon",
      longitude: 4.8651,
      latitude: 45.7437
    },
    site: {
      name: "Institut Lumière",
      price: 8.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY],
      email: "",
      telNumber: "04 78 78 18 00",
      website: "https://www.institut-lumiere.org/",
      shortDescription: "Musée dédié à l'histoire du cinéma.",
      longDescription: "L'Institut Lumière est un musée consacré à la découverte et à l'histoire du cinéma, installé dans la villa des frères Lumière."
    }
  },
  {
    address: {
      houseNumber: "12",
      street: "Rue de la République",
      zip: "69001",
      cityName: "Lyon",
      longitude: 4.8357,
      latitude: 45.7640
    },
    site: {
      name: "Musée des Confluences",
      price: 9.0,
      type: "MUSEUM",
      tags: [SiteTag.NOLOSAY, SiteTag.DEAF_FRIENDLY],
      email: "",
      telNumber: "04 28 00 40 00",
      website: "https://www.museedesconfluences.fr/",
      shortDescription: "Musée des sciences et des sociétés.",
      longDescription: "Le Musée des Confluences est un musée d'histoire naturelle, d'anthropologie et de science, offrant une approche interdisciplinaire unique."
    }
  },
  {
    address: {
      houseNumber: "14",
      street: "Place de la Gare",
      zip: "69100",
      cityName: "Villeurbanne",
      longitude: 4.8827,
      latitude: 45.7653
    },
    site: {
      name: "Musée de l'Automobile",
      price: 6.0,
      type: "MUSEUM",
      tags: [SiteTag.DISABILITY_FRIENDLY],
      email: "",
      telNumber: "04 78 60 07 00",
      website: "https://www.musee-automobile.fr/",
      shortDescription: "Musée dédié à l'histoire de l'automobile.",
      longDescription: "Ce musée retrace l'histoire de l'automobile avec des collections de voitures anciennes et modernes."
    }
  },
  {
    address: {
      houseNumber: "11",
      street: "Rue des Fossés Saint-Jacques",
      zip: "75005",
      cityName: "Paris",
      longitude: 2.3453,
      latitude: 48.8435
    },
    site: {
      name: "Musée de la Préfecture de Police",
      price: 0.0,
      type: "MUSEUM",
      tags: [SiteTag.BLIND_FRIENDLY],
      email: "",
      telNumber: "01 53 73 56 80",
      website: "https://www.prefecturedepolice.fr/",
      shortDescription: "Musée dédié à l'histoire de la police à Paris.",
      longDescription: "Ce musée retrace l'histoire de la police à Paris à travers des objets, des documents et des expositions interactives."
    }
  }
]


export async function seedSites() {
  let address: Address[] = [];

  try {
    for (const siteData of sitesData) {
      const city = await prisma.city.findFirst({
        where: {
          name: siteData.address.cityName,
          zip:  {contains: siteData.address.zip.substring(0, 2)},

        },
      });

      if (!city) {
        console.error(`Ville non trouvée: ${siteData.address.cityName}`);
        continue;
      }

      // Upsert de l'adresse et création des sites associés
      address.push( await prisma.address.upsert({
        where: {
          houseNumber_street_zip_cityId: {
            houseNumber: siteData.address.houseNumber,
            street: siteData.address.street,
            zip: siteData.address.zip,
            cityId: city.id,
          },
        },
        update: {},
        create: {
          houseNumber: siteData.address.houseNumber,
          street: siteData.address.street,
          zip: siteData.address.zip,
          cityId: city.id,
          longitude: siteData.address.longitude,
          latitude: siteData.address.latitude,
          sites: {
            create: {
              name: siteData.site.name,
              price: siteData.site.price,
              type: siteData.site.type,
              tags: siteData.site.tags,
              email: siteData.site.email,
              telNumber: siteData.site.telNumber,
              website: siteData.site.website,
              shortDescription: siteData.site.shortDescription,
              longDescription: siteData.site.longDescription,
            },
          },
        },
      })
    );
    }

    console.log('Seeding des sites terminé avec succès.');
  } catch (error) {
    console.error('Erreur lors du seeding des sites:', error);
  } finally {
    await prisma.$disconnect();
  }

  return address;
}