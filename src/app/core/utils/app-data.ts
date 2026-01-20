import {Select} from '../../interfaces/core/select';
import {PaymentMethod} from '../../interfaces/common/payment-method.interface';

export const DATA_BOOLEAN: Select[] = [
  {value: true, viewValue: 'Yes'},
  {value: false, viewValue: 'No'},
];



export const PAYMENT_METHODS: PaymentMethod[] = [
  // {
  //   name: 'Bkash',
  //   image: '/assets/images/payments/bkash-icon.png',
  //   slug: 'bkash',
  // },
  // {
  //   name: 'Nagad',
  //   image: '/assets/images/payments/Nagad-Logo.png',
  //   slug: 'nagad',
  // },
  // {
  //   name: 'Rocket',
  //   image: '/assets/images/payments/rocket-icon.png',
  //   slug: 'rocket',
  // },

  {
    name: 'SSLCOMMERZ',
    image: '/payment1.jpg',
    slug: 'SSl Commerz',
  },

]


export const COMPLAIN_SUBJECT: Select[] = [
  {value: 0, viewValue: 'General Complain'},
  {value: 1, viewValue: 'Product Return'},
  {value: 2, viewValue: 'Product return'},
  {value: 3, viewValue: 'Product refund'},
  {value: 4, viewValue: 'Date Expire Issue'},
  {value: 5, viewValue: 'Price Issue'},
  {value: 6, viewValue: 'Delivery Issue'},
  {value: 7, viewValue: 'Customer Service Issue'},
  {value: 8, viewValue: 'Others'},
];

export const MONTHS: Select[] = [
  {value: 1, viewValue: 'January'},
  {value: 2, viewValue: 'February'},
  {value: 3, viewValue: 'March'},
  {value: 4, viewValue: 'April'},
  {value: 5, viewValue: 'May'},
  {value: 6, viewValue: 'June'},
  {value: 7, viewValue: 'July'},
  {value: 8, viewValue: 'August'},
  {value: 9, viewValue: 'September'},
  {value: 10, viewValue: 'October'},
  {value: 11, viewValue: 'November'},
  {value: 12, viewValue: 'December'},
];

export const RESIDENT: Select[] = [
  {value: 'Immigrant', viewValue: 'Immigrant'},
  {value: 'Non-Immigrant', viewValue: 'Non-Immigrant'},
];

export const RESIDENTBN: Select[] = [
  {value: 'অভিবাসী', viewValue: 'অভিবাসী'},
  {value: 'অনাবাসী ভিসাধারী', viewValue: 'অনাবাসী ভিসাধারী'},
];

export type SEO_PAGE_TYPES = 'home' | 'our-leaders' | 'notice' | 'reports' | 'all-news' | 'jatio-sthai-committee'| 'all-program' | 'conference' | 'all-videos';

export const COUNTRY_DB: any[] = [
  {
    "name": "Bangladesh",
    "city": [
      "Dhaka Division", "Barisal Division", "Chittagong Division", "Khulna Division", "Mymensingh Division", "Rajshahi Division", "Rangpur Division", "Sylhet Division"
    ]
  },
  {
    "name": "Afghanistan",
    "city": [
      "Badakhshan", "Badghis", "Baghlan", "Balkh", "Bamyan", "Dakyundi", "Farah", "Faryab", "Ghazni", "Ghor", "Helmand", "Herat", "Jowzjan", "Kabul", "Kandahar", "Kapisa", "Khost", "Kunar", "Kunduz", "Laghman", "Logar", "Maidan Wardak", "Nagarhar", "Nimruz", "Nuristan", "Paktia", "Panjshir", "Parwan", "Samangan", "Sar-e Pol", "Takhar", "Urozgan", "Zabul"
    ]
  },
  {
    "name": "Albania",
    "city": [
      "Berat County", "Dibër County", "Durrës County", "Elbasan County", "Fier County", "Gjirokastër County", "Korçë County", "Kukës County", "Lezhë County", "Shkodër County", "Tiranë County", "Vlorë County"
    ]
  },
  {
    "name": "Algeria",
    "city": [
      "Adrar", "Aïn Defla", "Aïn Témouchent", "Alger (Algiers)", "Annaba", "Batna", "Béchar", "Béjaïa", "Biskra", "Blida", "Bordj Bou Arréridj", "Bouira", "Boumerdès", "Chlef", "Constantine", "Djelfa", "El Bayadh", "El Oued", "El Tarf", "Ghardaïa", "Guelma", "Illizi", "Jijel", "Khenchela", "Laghouat", "Mascara", "Médéa", "Mila", "Mostaganem", "M'Sila", "Naama", "Oran", "Ouargla", "Oum El Bouaghi", "Relizane", "Saïda", "Sétif", "Sidi Bel Abbès", "Skikda", "Souk Ahras", "Tamanrasset", "Tébessa", "Tiaret", "Tindouf", "Tipaza", "Tissemsilt", "Tizi Ouzou", "Tlemcen"
    ]
  },
  {
    "name": "Andorra",
    "city": [
      "Andorra la Vella", "Canillo", "Encamp", "Escaldes-Engordany", "La Massana", "Ordino", "Sant Julià de Lòria"
    ]
  },
  {
    "name": "Angola",
    "city": [
      "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
    ]
  },
  {
    "name": "Argentina",
    "city": [
      "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
    ]
  },
  {
    "name": "Australia",
    "city": [
      "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"
    ]
  },
  {
    "name": "Austria",
    "city": [
      "Burgenland", "Carinthia", "Lower Austria", "Upper Austria", "Salzburg", "Styria", "Tyrol", "Vorarlberg", "Vienna"
    ]
  },
  {
    "name": "Bahamas",
    "city": [
      "Acklins", "Berry Islands", "Bimini", "Black Point", "Cat Island", "Central Abaco", "Central Andros", "Central Eleuthera", "City of Freeport", "Crooked Island", "East Grand Bahama", "Exuma", "Grand Cay", "Harbour Island", "Hope Town", "Inagua", "Long Island", "Mangrove Cay", "Mayaguana", "Moore's Island", "North Abaco", "North Andros", "North Eleuthera", "Ragged Island", "Rum Cay", "San Salvador", "South Abaco", "South Andros", "South Eleuthera", "Spanish Wells", "West Grand Bahama"
    ]
  },
  {
    "name": "Bahrain",
    "city": [
      "Capital", "Muharraq", "Northern", "Southern"
    ]
  },
  {
    "name": "Barbados",
    "city": [
      "Christ Church", "Saint Andrew", "Saint George", "Saint James", "Saint John", "Saint Joseph", "Saint Lucy", "Saint Michael", "Saint Peter", "Saint Philip", "Saint Thomas"
    ]
  },
  {
    "name": "Belarus",
    "city": [
      "Brest Region", "Gomel Region", "Grodno Region", "Minsk Region", "Mogilev Region", "Vitebsk Region"
    ]
  },
  {
    "name": "Belgium",
    "city": [
      "Antwerp", "East Flanders", "Flemish Brabant", "Hainaut", "Liège", "Limburg", "Luxembourg", "Namur", "Walloon Brabant", "West Flanders"
    ]
  },
  {
    "name": "Belize",
    "city": [
      "Belize District", "Cayo District", "Corozal District", "Orange Walk District", "Stann Creek District", "Toledo District"
    ]
  },
  {
    "name": "Benin",
    "city": [
      "Alibori", "Atakora", "Atlantique", "Borgou", "Collines", "Donga", "Kouffo", "Littoral", "Mono", "Ouémé", "Plateau", "Zou"
    ]
  },
  {
    "name": "Bhutan",
    "city": [
      "Bumthang", "Chukha", "Dagana", "Gasa", "Haa", "Lhuntse", "Mongar", "Paro", "Pemagatshel", "Punakha", "Samdrup Jongkhar", "Samtse", "Sarpang", "Thimphu", "Trashigang", "Trashiyangtse", "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang"
    ]
  },
  {
    "name": "Bolivia",
    "city": [
      "Chuquisaca", "Cochabamba", "El Beni", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"
    ]
  },
  {
    "name": "Bosnia and Herzegovina",
    "city": [
      "Brčko District", "Federation of Bosnia and Herzegovina", "Republika Srpska"
    ]
  },
  {
    "name": "Botswana",
    "city": [
      "Central District", "Ghanzi District", "Kgalagadi District", "Kgatleng District", "Kweneng District", "North-East District", "North-West District", "South-East District", "Southern District"
    ]
  },
  {
    "name": "Brazil",
    "city": [
      "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
    ]
  },
  {
    "name": "Canada",
    "city": [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
    ]
  },
  {
    "name": "Chile",
    "city": [
      "Aysén", "Antofagasta", "Araucanía", "Arica y Parinacota", "Atacama", "Biobío", "Coquimbo", "Los Lagos", "Los Ríos", "Magallanes", "Maule", "O'Higgins", "Santiago Metropolitan Region", "Tarapacá", "Valparaíso"
    ]
  },
  {
    "name": "China",
    "city": [
      "Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hong Kong", "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Macau", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanghai", "Shanxi", "Sichuan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang"
    ]
  },
  {
    "name": "Colombia",
    "city": [
      "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés and Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"
    ]
  },
  {
    "name": "Croatia",
    "city": [
      "Bjelovar-Bilogora", "Brod-Posavina", "Dubrovnik-Neretva", "Istria", "Karlovac", "Koprivnica-Križevci", "Krapina-Zagorje", "Lika-Senj", "Međimurje", "Osijek-Baranja", "Požega-Slavonia", "Primorje-Gorski Kotar", "Šibenik-Knin", "Sisak-Moslavina", "Split-Dalmatia", "Varaždin", "Virovitica-Podravina", "Vukovar-Syrmia", "Zadar", "Zagreb County", "Zagreb City"
    ]
  },
  {
    "name": "Cuba",
    "city": [
      "Artemisa", "Camagüey", "Ciego de Ávila", "Cienfuegos", "Granma", "Guantánamo", "Havana", "Holguín", "Isla de la Juventud", "Las Tunas", "Matanzas", "Mayabeque", "Pinar del Río", "Sancti Spíritus", "Santiago de Cuba", "Villa Clara"
    ]
  },
  {
    "name": "Czech Republic",
    "city": [
      "Central Bohemian Region", "Hradec Králové Region", "Karlovy Vary Region", "Liberec Region", "Moravian-Silesian Region", "Olomouc Region", "Pardubice Region", "Plzeň Region", "Prague", "South Bohemian Region", "South Moravian Region", "Ústí nad Labem Region", "Vysočina Region", "Zlín Region"
    ]
  },
  {
    "name": "Denmark",
    "city": [
      "Capital Region", "Central Denmark Region", "North Denmark Region", "Region of Southern Denmark", "Region Zealand"
    ]
  },
  {
    "name": "Djibouti",
    "city": [
      "Ali Sabieh Region", "Arta Region", "Dikhil Region", "Djibouti Region", "Obock Region", "Tadjourah Region"
    ]
  },
  {
    "name": "Dominican Republic",
    "city": [
      "Azua", "Baoruco", "Barahona", "Dajabón", "Distrito Nacional", "Duarte", "Elías Piña", "El Seibo", "Espaillat", "Hato Mayor", "Hermanas Mirabal", "Independencia", "La Altagracia", "La Romana", "La Vega", "María Trinidad Sánchez", "Monseñor Nouel", "Monte Cristi", "Monte Plata", "Pedernales", "Peravia", "Puerto Plata", "Samaná", "San Cristóbal", "San José de Ocoa", "San Juan", "San Pedro de Macorís", "Sánchez Ramírez", "Santiago", "Santiago Rodríguez", "Santo Domingo", "Valverde"
    ]
  },
  {
    "name": "Ecuador",
    "city": [
      "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora-Chinchipe"
    ]
  },
  {
    "name": "Egypt",
    "city": [
      "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Giza", "Ismailia", "Kafr El Sheikh", "Luxor", "Matruh", "Minya", "Monufia", "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"
    ]
  },
  {
    "name": "El Salvador",
    "city": [
      "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", "La Paz", "La Unión", "Morazán", "San Miguel", "San Salvador", "San Vicente", "Santa Ana", "Sonsonate", "Usulután"
    ]
  },
  {
    "name": "Ethiopia",
    "city": [
      "Addis Ababa", "Afar Region", "Amhara Region", "Benishangul-Gumuz Region", "Dire Dawa", "Gambela Region", "Harari Region", "Oromia Region", "Sidama Region", "Somali Region", "Southern Nations, Nationalities, and Peoples' Region (SNNPR)", "Tigray Region"
    ]
  },
  {
    "name": "Finland",
    "city": [
      "Åland Islands", "Central Finland", "Central Ostrobothnia", "Kainuu", "Kymenlaakso", "Lapland", "North Karelia", "Northern Ostrobothnia", "Northern Savonia", "Ostrobothnia", "Päijänne Tavastia", "Pirkanmaa", "Satakunta", "South Karelia", "Southern Ostrobothnia", "Southern Savonia", "Uusimaa", "Southwest Finland"
    ]
  },
  {
    "name": "France",
    "city": [
      "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
    ]
  },
  {
    "name": "Germany",
    "city": [
      "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
    ]
  },
  {
    "name": "Ghana",
    "city": [
      "Ashanti Region", "Bono Region", "Bono East Region", "Central Region", "Eastern Region", "Greater Accra Region", "Northern Region", "North East Region", "Oti Region", "Savannah Region", "Upper East Region", "Upper West Region", "Volta Region", "Western Region", "Western North Region"
    ]
  },
  {
    "name": "Greece",
    "city": [
      "Aetolia-Acarnania", "Arcadia", "Argolis", "Attica", "Boeotia", "Chalkidiki", "Chania", "Corinthia", "Drama", "Elis", "Euboea", "Evrytania", "Florina", "Grevena", "Heraklion", "Imathia", "Ioannina", "Karditsa", "Kastoria", "Kavala", "Kefalonia", "Kilkis", "Kozani", "Laconia", "Larissa", "Lasithi", "Lefkada", "Magnesia", "Messenia", "Pella", "Phocis", "Phthiotis", "Pieria", "Preveza", "Rethymno", "Rhodope", "Samos", "Serres", "Thesprotia", "Thessaloniki", "Trikala", "Xanthi", "Zakynthos"
    ]
  },
  {
    "name": "Guatemala",
    "city": [
      "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla", "Guatemala Department", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"
    ]
  },
  {
    "name": "Honduras",
    "city": [
      "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
    ]
  },
  {
    "name": "Hungary",
    "city": [
      "Bács-Kiskun", "Baranya", "Békés", "Borsod-Abaúj-Zemplén", "Csongrád-Csanád", "Fejér", "Győr-Moson-Sopron", "Hajdú-Bihar", "Heves", "Jász-Nagykun-Szolnok", "Komárom-Esztergom", "Nógrád", "Pest", "Somogy", "Szabolcs-Szatmár-Bereg", "Tolna", "Vas", "Veszprém", "Zala"
    ]
  },
  {
    "name": "Iceland",
    "city": [
      "Austurland", "Höfuðborgarsvæðið", "Norðurland eystra", "Norðurland vestra", "Suðurland", "Suðurnes", "Vestfirðir", "Vesturland"
    ]
  },
  {
    "name": "India",
    "city": [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Lakshadweep", "Ladakh", "Puducherry"
    ]
  },
  {
    "name": "Indonesia",
    "city": [
      "Aceh", "Bali", "Banten", "Bengkulu", "Gorontalo", "Jakarta", "Jambi", "West Java", "Central Java", "East Java", "West Kalimantan", "South Kalimantan", "Central Kalimantan", "East Kalimantan", "North Kalimantan", "Riau Islands", "Lampung", "Maluku", "North Maluku", "West Nusa Tenggara", "East Nusa Tenggara", "Papua", "West Papua", "Riau", "West Sulawesi", "South Sulawesi", "Central Sulawesi", "Southeast Sulawesi", "North Sulawesi", "West Sumatra", "South Sumatra", "North Sumatra", "Yogyakarta"
    ]
  },
  {
    "name": "Iran",
    "city": [
      "Alborz", "Ardabil", "Bushehr", "Chaharmahal and Bakhtiari", "East Azerbaijan", "Fars", "Gilan", "Golestan", "Hamadan", "Hormozgan", "Ilam", "Isfahan", "Kerman", "Kermanshah", "Khuzestan", "Kohgiluyeh and Boyer-Ahmad", "Kurdistan", "Lorestan", "Markazi", "Mazandaran", "North Khorasan", "Qazvin", "Qom", "Razavi Khorasan", "Semnan", "Sistan and Baluchestan", "South Khorasan", "Tehran", "West Azerbaijan", "Yazd", "Zanjan"
    ]
  },
  {
    "name": "Iraq",
    "city": [
      "Al Anbar", "Al Muthanna", "Al-Qadisiyyah", "Babil", "Baghdad", "Basra", "Dhi Qar", "Diyala", "Dohuk", "Erbil", "Karbala", "Kirkuk", "Maysan", "Najaf", "Nineveh", "Saladin", "Sulaymaniyah", "Wasit"
    ]
  },
  {
    "name": "Ireland",
    "city": [
      "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"
    ]
  },
  {
    "name": "Italy",
    "city": [
      "Abruzzo", "Aosta Valley", "Apulia", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli Venezia Giulia", "Lazio", "Liguria", "Lombardy", "Marche", "Molise", "Piedmont", "Sardinia", "Sicily", "Trentino-South Tyrol", "Tuscany", "Umbria", "Veneto"
    ]
  },
  {
    "name": "Jamaica",
    "city": [
      "Clarendon", "Hanover", "Kingston", "Manchester", "Portland", "Saint Andrew", "Saint Ann", "Saint Catherine", "Saint Elizabeth", "Saint James", "Saint Mary", "Saint Thomas", "Trelawny", "Westmoreland"
    ]
  },
  {
    "name": "Japan",
    "city": [
      "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma", "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa", "Kochi", "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata", "Oita", "Okayama", "Okinawa", "Osaka", "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima", "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
    ]
  },
  {
    "name": "Jordan",
    "city": [
      "Ajloun", "Amman", "Aqaba", "Balqa", "Irbid", "Jerash", "Karak", "Ma'an", "Madaba", "Mafraq", "Tafilah", "Zarqa"
    ]
  },
  {
    "name": "Kazakhstan",
    "city": [
      "Akmola Region", "Aktobe Region", "Almaty", "Almaty Region", "Atyrau Region", "East Kazakhstan Region", "Karaganda Region", "Kostanay Region", "Kyzylorda Region", "Mangystau Region", "North Kazakhstan Region", "Nur-Sultan", "Pavlodar Region", "Shymkent", "Turkistan Region", "West Kazakhstan Region", "Zhambyl Region"
    ]
  },
  {
    "name": "Kenya",
    "city": [
      "Baringo County", "Bomet County", "Bungoma County", "Busia County", "Elgeyo-Marakwet County", "Embu County", "Garissa County", "Homa Bay County", "Isiolo County", "Kajiado County", "Kakamega County", "Kericho County", "Kiambu County", "Kilifi County", "Kirinyaga County", "Kisii County", "Kisumu County", "Kitui County", "Kwale County", "Laikipia County", "Lamu County", "Machakos County", "Makueni County", "Mandera County", "Marsabit County", "Meru County", "Migori County", "Mombasa County", "Murang'a County", "Nairobi County", "Nakuru County", "Nandi County", "Narok County", "Nyamira County", "Nyandarua County", "Nyeri County", "Samburu County", "Siaya County", "Taita-Taveta County", "Tana River County", "Tharaka-Nithi County", "Trans-Nzoia County", "Turkana County", "Uasin Gishu County", "Vihiga County", "Wajir County", "West Pokot County"
    ]
  },
  {
    "name": "Kiribati",
    "city": [
      "Gilbert Islands", "Line Islands", "Phoenix Islands"
    ]
  },
  {
    "name": "North Korea",
    "city": [
      "Chagang", "North Hamgyong", "South Hamgyong", "North Hwanghae", "South Hwanghae", "Kangwon", "North Pyongan", "South Pyongan", "Ryanggang", "Pyongyang (Capital City)", "Rason (Special City)"
    ]
  },
  {
    "name": "South Korea",
    "city": [
      "Busan", "Daegu", "Daejeon", "Gangwon", "Gwangju", "Gyeonggi", "Incheon", "Jeju", "North Chungcheong", "North Gyeongsang", "North Jeolla", "Sejong", "Seoul", "South Chungcheong", "South Gyeongsang", "South Jeolla", "Ulsan"
    ]
  },
  {
    "name": "Kuwait",
    "city": [
      "Al Ahmadi", "Al Farwaniyah", "Al Jahra", "Capital", "Hawalli", "Mubarak Al-Kabeer"
    ]
  },
  {
    "name": "Kyrgyzstan",
    "city": [
      "Batken Region", "Chuy Region", "Issyk-Kul Region", "Jalal-Abad Region", "Naryn Region", "Osh Region", "Talas Region", "Bishkek (Capital City)", "Osh (City)"
    ]
  },
  {
    "name": "Laos",
    "city": [
      "Attapeu", "Bokeo", "Bolikhamsai", "Champasak", "Houaphanh", "Khammouane", "Luang Namtha", "Luang Prabang", "Oudomxay", "Phongsaly", "Sainyabuli", "Salavan", "Savannakhet", "Sekong", "Vientiane Prefecture", "Vientiane Province", "Xiangkhouang"
    ]
  },
  {
    "name": "Latvia",
    "city": [
      "Aizkraukle Municipality", "Aluksne Municipality", "Balvi Municipality", "Bauska Municipality", "Cesis Municipality", "Daugavpils City", "Daugavpils Municipality", "Dobele Municipality", "Gulbene Municipality", "Jekabpils Municipality", "Jelgava City", "Jelgava Municipality", "Jurmala City", "Kraslava Municipality", "Kuldiga Municipality", "Liepaja City", "Liepaja Municipality", "Limbazi Municipality", "Ludza Municipality", "Madona Municipality", "Ogre Municipality", "Preili Municipality", "Rezekne City", "Rezekne Municipality", "Riga City", "Riga Municipality", "Saldus Municipality", "Sigulda Municipality", "Smiltene Municipality", "Talsi Municipality", "Tukums Municipality", "Valka Municipality", "Valmiera Municipality", "Ventspils City", "Ventspils Municipality"
    ]
  },
  {
    "name": "Lebanon",
    "city": [
      "Akkar", "Baalbek-Hermel", "Beirut", "Beqaa", "Keserwan-Jbeil", "Mount Lebanon", "Nabatieh", "North", "South"
    ]
  },
  {
    "name": "Lesotho",
    "city": [
      "Berea", "Butha-Buthe", "Leribe", "Mafeteng", "Maseru", "Mohale's Hoek", "Mokhotlong", "Qacha's Nek", "Quthing", "Thaba-Tseka"
    ]
  },
  {
    "name": "Liberia",
    "city": [
      "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland", "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe"
    ]
  },
  {
    "name": "Libya",
    "city": [
      "Al Butnan", "Al Jabal al Akhdar", "Al Jabal al Gharbi", "Al Jafara", "Al Jufrah", "Al Kufrah", "Al Marj", "Al Marqab", "Al Wahat", "Al Zawiya", "Benghazi", "Derna", "Ghat", "Jabal al Ahdar", "Jabal al Gharbi", "Misrata", "Murqub", "Murzuq", "Sabha", "Sirte", "Tripoli", "Wadi al Hayat", "Wadi al Shatii", "Zawiya", "Zintan"
    ]
  },
  {
    "name": "Liechtenstein",
    "city": [
      "Balzers", "Eschen", "Gamprin", "Mauren", "Planken", "Ruggell", "Schaan", "Schellenberg", "Triesen", "Triesenberg", "Vaduz"
    ]
  },
  {
    "name": "Lithuania",
    "city": [
      "Alytus County", "Kaunas County", "Klaipėda County", "Marijampolė County", "Panevėžys County", "Šiauliai County", "Tauragė County", "Telšiai County", "Utena County", "Vilnius County"
    ]
  },
  {
    "name": "Luxembourg",
    "city": [
      "Capellen", "Clervaux", "Diekirch", "Echternach", "Esch-sur-Alzette", "Grevenmacher", "Luxembourg", "Mersch", "Redange", "Remich", "Vianden", "Wiltz"
    ]
  },
  {
    "name": "Madagascar",
    "city": [
      "Alaotra-Mangoro", "Amoron'i Mania", "Analamanga", "Analanjirofo", "Androy", "Anosy", "Atsimo-Andrefana", "Atsimo-Atsinanana", "Atsinanana", "Betsiboka", "Boeny", "Bongolava", "Diana", "Haute Matsiatra", "Ihorombe", "Itasy", "Melaky", "Menabe", "Sava", "Sofia", "Vakinankaratra", "Vatovavy-Fitovinany"
    ]
  },
  {
    "name": "Malawi",
    "city": [
      "Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa", "Dedza", "Dowa", "Karonga", "Kasungu", "Likoma", "Lilongwe", "Machinga", "Mangochi", "Mchinji", "Mulanje", "Mwanza", "Mzimba", "Neno", "Nkhata Bay", "Nkhotakota", "Nsanje", "Ntcheu", "Ntchisi", "Phalombe", "Rumphi", "Salima", "Thyolo", "Zomba"
    ]
  },
  {
    "name": "Malaysia",
    "city": [
      "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
    ]
  },
  {
    "name": "Maldives",
    "city": [
      "Addu City", "Fuvahmulah City", "Male City", "Meemu Atoll", "Vaavu Atoll"
    ]
  },
  {
    "name": "Mali",
    "city": [
      "Bamako", "Gao Region", "Kayes Region", "Kidal Region", "Koulikoro Region", "Mopti Region", "Segou Region", "Sikasso Region", "Taoudenni Region", "Timbuktu Region"
    ]
  },
  {
    "name": "Malta",
    "city": [
      "Gozo", "Malta"
    ]
  },
  {
    "name": "Marshall Islands",
    "city": [
      "Ailinglaplap", "Ailuk", "Arno", "Aur", "Bikini and Kili", "Ebon", "Enewetak and Ujelang", "Jabat", "Jaluit", "Kwajalein", "Lae", "Lib", "Likiep", "Majuro", "Maloelap", "Mejit", "Mili", "Namdrik", "Namu", "Rongelap", "Wotho", "Wotje"
    ]
  },
  {
    "name": "Martinique",
    "city": [
      "Fort-de-France", "La Trinité", "Le Marin", "Saint-Pierre"
    ]
  },
  {
    "name": "Mauritania",
    "city": [
      "Adrar", "Assaba", "Brakna", "Dakhlet Nouadhibou", "Gorgol", "Guidimaka", "Hodh Ech Chargui", "Hodh El Gharbi", "Inchiri", "Nouakchott-Nord", "Nouakchott-Ouest", "Nouakchott-Sud", "Tagant", "Tiris Zemmour", "Trarza"
    ]
  },
  {
    "name": "Mauritius",
    "city": [
      "Agalega Islands", "Beau Bassin-Rose Hill", "Black River", "Cargados Carajos Shoals", "Flacq", "Grand Port", "Moka", "Pamplemousses", "Plaines Wilhems", "Port Louis", "Riviere du Rempart", "Rodrigues Island", "Savanne", "Vacoas-Phoenix"
    ]
  },
  {
    "name": "Mayotte",
    "city": [
      "Dzaoudzi", "Pamandzi", "Bandrele", "Dembeni", "Boueni", "Chirongui", "Sada", "Tsingoni", "Mtsamboro", "Koungou", "Mamoudzou", "M’tsangamouji", "Acoua", "Bandraboua", "Kani-Kéli", "Ouangani"
    ]
  },
  {
    "name": "Mexico",
    "city": [
      "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de Mexico (Mexico City)", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico State", "Michoacan", "Morelos", "Nayarit", "Nuevo Leon", "Oaxaca", "Puebla", "Queretaro", "Quintana Roo", "San Luis Potosi", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatan", "Zacatecas"
    ]
  },
  {
    "name": "Micronesia",
    "city": [
      "Chuuk State", "Kosrae State", "Pohnpei State", "Yap State"
    ]
  },
  {
    "name": "Moldova",
    "city": [
      "Anenii Noi District", "Basarabeasca District", "Briceni District", "Cahul District", "Cantemir District", "Călărași District", "Căușeni District", "Cimișlia District", "Criuleni District", "Dondușeni District", "Drochia District", "Dubăsari District", "Edineț District", "Fălești District", "Florești District", "Glodeni District", "Hîncești District", "Ialoveni District", "Leova District", "Nisporeni District", "Ocnița District", "Orhei District", "Rezina District", "Rîșcani District", "Sîngerei District", "Șoldănești District", "Soroca District", "Ștefan Vodă District", "Strășeni District", "Taraclia District", "Telenești District", "Ungheni District", "Autonomous Territorial Unit of Gagauzia", "Bălți Municipality", "Chișinău Municipality", "Bender (Tighina) Municipality", "Tiraspol Municipality"
    ]
  },
  {
    "name": "Monaco",
    "city": [
      "La Condamine", "Fontvieille", "Jardin Exotique", "Larvotto", "Les Moneghetti", "Monaco-Ville", "Monte-Carlo", "Moulins", "Port-Hercule", "Saint-Roman"
    ]
  },
  {
    "name": "Mongolia",
    "city": [
      "Arkhangai Province", "Bayan-Ölgii Province", "Bayankhongor Province", "Bulgan Province", "Darkhan-Uul Province", "Dornod Province", "Dornogovi Province", "Dundgovi Province", "Govi-Altai Province", "Govi-Sumber Province", "Khentii Province", "Khovd Province", "Khövsgöl Province", "Ömnögovi Province", "Orkhon Province", "Övörkhangai Province", "Selenge Province", "Sükhbaatar Province", "Töv Province", "Ulaanbaatar", "Uvs Province", "Zavkhan Province"
    ]
  },
  {
    "name": "Montenegro",
    "city": [
      "Andrijevica", "Bar", "Berane", "Bijelo Polje", "Budva", "Cetinje", "Danilovgrad", "Gusinje", "Herceg Novi", "Kolašin", "Kotor", "Mojkovac", "Nikšić", "Petnjica", "Plav", "Pljevlja", "Plužine", "Podgorica", "Rožaje", "Šavnik", "Tivat", "Tuzi", "Ulcinj", "Žabljak"
    ]
  },
  {
    "name": "Montserrat",
    "city": [
      "Saint Anthony", "Saint Georges", "Saint Peter"
    ]
  },
  {
    "name": "Morocco",
    "city": [
      "Béni Mellal-Khénifra", "Casablanca-Settat", "Dakhla-Oued Ed-Dahab", "Drâa-Tafilalet", "Fès-Meknès", "Guelmim-Oued Noun", "Laâyoune-Sakia El Hamra", "Marrakesh-Safi", "Oriental", "Rabat-Salé-Kénitra", "Souss-Massa", "Tanger-Tétouan-Al Hoceïma"
    ]
  },
  {
    "name": "Mozambique",
    "city": [
      "Cabo Delgado Province", "Gaza Province", "Inhambane Province", "Manica Province", "Maputo City", "Maputo Province", "Nampula Province", "Niassa Province", "Sofala Province", "Tete Province", "Zambezia Province"
    ]
  },
  {
    "name": "Myanmar",
    "city": [
      "Ayeyarwady Region", "Bago Region", "Chin State", "Kachin State", "Kayah State", "Kayin State", "Magway Region", "Mandalay Region", "Mon State", "Naypyidaw Union Territory", "Rakhine State", "Sagaing Region", "Shan State", "Tanintharyi Region", "Yangon Region"
    ]
  },
  {
    "name": "Namibia",
    "city": [
      "Erongo Region", "Hardap Region", "Karas Region", "Kavango East Region", "Kavango West Region", "Khomas Region", "Kunene Region", "Ohangwena Region", "Omaheke Region", "Omusati Region", "Oshana Region", "Oshikoto Region", "Otjozondjupa Region", "Zambezi Region"
    ]
  },
  {
    "name": "Nauru",
    "city": [
      "Aiwo District", "Anabar District", "Anetan District", "Anibare District", "Baiti District", "Boe District", "Buada District", "Denigomodu District", "Ewa District", "Ijuw District", "Meneng District", "Nibok District", "Uaboe District", "Yaren District"
    ]
  },
  {
    "name": "Nepal",
    "city": [
      "Bagmati Province", "Gandaki Province", "Karnali Province", "Lumbini Province", "Madhesh Province", "Province No. 1", "Sudurpashchim Province"
    ]
  },
  {
    "name": "Netherlands",
    "city": [
      "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"
    ]
  },
  {
    "name": "New Caledonia",
    "city": [
      "North Province", "South Province", "Loyalty Islands Province"
    ]
  },
  {
    "name": "New Zealand",
    "city": [
      "Auckland", "Bay of Plenty", "Canterbury", "Chatham Islands", "Gisborne", "Hawke's Bay", "Manawatu-Wanganui", "Marlborough", "Nelson", "Northland", "Otago", "Southland", "Taranaki", "Tasman", "Waikato", "Wellington", "West Coast"
    ]
  },
  {
    "name": "Nicaragua",
    "city": [
      "Boaco", "Carazo", "Chinandega", "Chontales", "Estelí", "Granada", "Jinotega", "León", "Madriz", "Managua", "Masaya", "Matagalpa", "Nueva Segovia", "Río San Juan", "Rivas", "Autonomous Region of the North Caribbean Coast", "Autonomous Region of the South Caribbean Coast"
    ]
  },
  {
    "name": "Niger",
    "city": [
      "Agadez", "Diffa", "Dosso", "Maradi", "Niamey", "Tahoua", "Tillabéri", "Zinder"
    ]
  },
  {
    "name": "Nigeria",
    "city": [
      "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State", "Bauchi State", "Bayelsa State", "Benue State", "Borno State", "Cross River State", "Delta State", "Ebonyi State", "Edo State", "Ekiti State", "Enugu State", "Federal Capital Territory", "Gombe State", "Imo State", "Jigawa State", "Kaduna State", "Kano State", "Katsina State", "Kebbi State", "Kogi State", "Kwara State", "Lagos State", "Nasarawa State", "Niger State", "Ogun State", "Ondo State", "Osun State", "Oyo State", "Plateau State", "Rivers State", "Sokoto State", "Taraba State", "Yobe State", "Zamfara State"
    ]
  },
  {
    "name": "Niue",
    "city": [
      "Alofi North", "Alofi South", "Avatele", "Hakupu", "Hikutavake", "Lakepa", "Liku", "Makefu", "Mutalau", "Namukulu", "Toi", "Tuapa", "Vaiea", "Tamakautoga"
    ]
  },
  {
    "name": "Norfolk Island",
    "city": [
      "Kingston"
    ]
  },
  {
    "name": "North Macedonia",
    "city": [
      "Aerodrom", "Aračinovo", "Berovo", "Bitola", "Bogdanci", "Bogovinje", "Bosilovo", "Brvenica", "Butel", "Centar", "Centar Župa", "Čair", "Čaška", "Češinovo-Obleševo", "Čučer-Sandevo", "Debar", "Debarca", "Delčevo", "Demir Hisar", "Demir Kapija", "Dojran", "Dolneni", "Drugovo", "Gazi Baba", "Gevgelija", "Gostivar", "Gradsko", "Ilinden", "Jegunovce", "Karbinci", "Karpoš", "Kavadarci", "Kičevo", "Konče", "Kočani", "Kratovo", "Kriva Palanka", "Krivogaštani", "Kruševo", "Kumanovo", "Lipkovo", "Lozovo", "Makedonska Kamenica", "Makedonski Brod", "Mogila", "Negotino", "Novaci", "Novo Selo", "Ohrid", "Pehčevo", "Petrovec", "Plasnica", "Prilep", "Probištip", "Radoviš", "Rankovce", "Resen", "Rosoman", "Saraj", "Sopište", "Staro Nagoričane", "Štip", "Struga", "Strumica", "Studeničani", "Sveti Nikole", "Tearce", "Tetovo", "Valandovo", "Vasilevo", "Veles", "Vevčani", "Vinica", "Vrapčište", "Zelenikovo", "Zrnovci", "Želino"
    ]
  },
  {
    "name": "Northern Mariana Islands",
    "city": [
      "Northern Islands", "Rota", "Saipan", "Tinian"
    ]
  },
  {
    "name": "Norway",
    "city": [
      "Agder", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", "Rogaland", "Troms og Finnmark", "Trøndelag", "Vestfold og Telemark", "Vestland", "Viken"
    ]
  },
  {
    "name": "Oman",
    "city": [
      "Ad Dakhiliyah", "Ad Dhahirah", "Al Batinah North", "Al Batinah South", "Al Buraimi", "Al Wusta", "Ash Sharqiyah North", "Ash Sharqiyah South", "Dhofar", "Musandam", "Muscat"
    ]
  },
  {
    "name": "Pakistan",
    "city": [
      "Azad Jammu and Kashmir", "Balochistan", "Gilgit-Baltistan", "Islamabad Capital Territory", "Khyber Pakhtunkhwa", "Punjab", "Sindh"
    ]
  },
  {
    "name": "Palau",
    "city": [
      "Aimeliik", "Airai", "Angaur", "Hatohobei", "Kayangel", "Koror", "Melekeok", "Ngaraard", "Ngarchelong", "Ngardmau", "Ngatpang", "Ngchesar", "Ngeremlengui", "Ngiwal", "Peleliu", "Sonsorol"
    ]
  },
  {
    "name": "Palestine",
    "city": [
      "Bethlehem", "Deir al-Balah", "Gaza", "Hebron", "Jenin", "Jericho and Al Aghwar", "Jerusalem", "Khan Yunis", "Nablus", "North Gaza", "Qalqilya", "Rafah", "Ramallah and Al-Bireh", "Salfit", "Tubas", "Tulkarm"
    ]
  },
  {
    "name": "Panama",
    "city": [
      "Bocas del Toro", "Chiriquí", "Coclé", "Colón", "Darién", "Emberá-Wounaan Comarca", "Guna Yala", "Herrera", "Los Santos", "Ngäbe-Buglé Comarca", "Panamá Oeste", "Panamá Province", "Veraguas"
    ]
  },
  {
    "name": "Papua New Guinea",
    "city": [
      "Bougainville", "Central", "Chimbu", "East New Britain", "East Sepik", "Eastern Highlands", "Enga", "Gulf", "Hela", "Jiwaka", "Madang", "Manus", "Milne Bay", "Morobe", "National Capital District", "New Ireland", "Northern (Oro)", "Southern Highlands", "West New Britain", "West Sepik (Sandaun)", "Western (Fly)", "Western Highlands"
    ]
  },
  {
    "name": "Paraguay",
    "city": [
      "Alto Paraguay", "Alto Paraná", "Amambay", "Asunción Capital District", "Boquerón", "Caaguazú", "Caazapá", "Canindeyú", "Central", "Concepción", "Cordillera", "Guairá", "Itapúa", "Misiones", "Ñeembucú", "Paraguarí", "Presidente Hayes", "San Pedro"
    ]
  },
  {
    "name": "Peru",
    "city": [
      "Amazonas", "Ancash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Lima Province", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
    ]
  },
  {
    "name": "Philippines",
    "city": [
      "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan", "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque", "Masbate","Manila City", "Mertro Manila", "Makati City", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Pasay City", "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"
    ]
  },
  {
    "name": "Pitcairn Islands",
    "city": [
      "Adamstown"
    ]
  },
  {
    "name": "Poland",
    "city": [
      "Greater Poland", "Kuyavian-Pomeranian", "Lesser Poland", "Łódź", "Lower Silesian", "Lublin", "Lubusz", "Masovian", "Opole", "Podlaskie", "Pomeranian", "Silesian", "Subcarpathian", "Świętokrzyskie", "Warmian-Masurian", "West Pomeranian"
    ]
  },
  {
    "name": "Portugal",
    "city": [
      "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisbon", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu", "Azores", "Madeira"
    ]
  },
  {
    "name": "Puerto Rico",
    "city": [
      "Adjuntas", "Aguada", "Aguadilla", "Aguas Buenas", "Aibonito", "Añasco", "Arecibo", "Arroyo", "Barceloneta", "Barranquitas", "Bayamón", "Cabo Rojo", "Caguas", "Camuy", "Canóvanas", "Carolina", "Cataño", "Cayey", "Ceiba", "Ciales", "Cidra", "Coamo", "Comerío", "Corozal", "Culebra", "Dorado", "Fajardo", "Florida", "Guánica", "Guayama", "Guayanilla", "Guaynabo", "Gurabo", "Hatillo", "Hormigueros", "Humacao", "Isabela", "Jayuya", "Juana Díaz", "Juncos", "Lajas", "Lares", "Las Marías", "Las Piedras", "Loíza", "Luquillo", "Manatí", "Maricao", "Maunabo", "Mayagüez", "Moca", "Morovis", "Naguabo", "Naranjito", "Orocovis", "Patillas", "Peñuelas", "Ponce", "Quebradillas", "Rincón", "Río Grande", "Sabana Grande", "Salinas", "San Germán", "San Juan", "San Lorenzo", "San Sebastián", "Santa Isabel", "Toa Alta", "Toa Baja", "Trujillo Alto", "Utuado", "Vega Alta", "Vega Baja", "Vieques", "Villalba", "Yabucoa", "Yauco"
    ]
  },
  {
    "name": "Qatar",
    "city": [
      "Ad Dawhah", "Al Daayen", "Al Khor", "Al Rayyan", "Al Shamal", "Al Wakrah", "Al Shahaniya", "Umm Salal"
    ]
  },
  {
    "name": "Réunion",
    "city": [
      "Saint-Denis", "Saint-Paul", "Saint-Pierre", "Le Tampon", "Saint-André", "Saint-Louis", "Le Port", "Saint-Joseph", "Saint-Benoît", "Sainte-Marie", "Saint-Leu", "Petite-Île", "Salazie", "Cilaos", "L'Étang-Salé", "Sainte-Suzanne", "Les Avirons", "La Possession", "Bras-Panon", "Entre-Deux", "Sainte-Rose"
    ]
  },
  {
    "name": "Romania",
    "city": [
      "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brăila", "Brașov", "București (Bucharest)", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea"
    ]
  },
  // {
  //   "name": "Russian Federation",
  //   "city": [
  //     "Amur Oblast", "Arkhangelsk Oblast", "Astrakhan Oblast", "Belgorod Oblast", "Bryansk Oblast", "Chelyabinsk Oblast", "Irkutsk Oblast", "Ivanovo Oblast", "Kaliningrad Oblast", "Kaluga Oblast", "Kamchatka Krai", "Kemerovo Oblast", "Khabarovsk Krai", "Khanty-Mansi Autonomous Okrug", "Kirov Oblast", "Kostroma Oblast", "Krasnodar Krai", "Krasnoyarsk Krai", "Kurgan Oblast", "Kursk Oblast", "Leningrad Oblast", "Lipetsk Oblast", "Magadan Oblast", "Moscow Oblast", "Murmansk Oblast", "Nizhny Novgorod Oblast", "Novgorod Oblast", "Novosibirsk Oblast", "Omsk Oblast", "Orenburg Oblast", "Oryol Oblast", "Penza Oblast", "Perm Krai", "Primorsky Krai", "Pskov Oblast", "Rostov Oblast", "Ryazan Oblast", "Saint Petersburg", "Sakha (Yakutia) Republic", "Sakhalin Oblast", "Samara Oblast", "Saratov Oblast", "Sevastopol", "Smolensk Oblast", "Stavropol Krai", "Sverdlovsk Oblast", "Tambov Oblast", "Tomsk Oblast", "Tula Oblast", "Tver Oblast", "Tyumen Oblast", "Udmurt Republic", "Ulyanovsk Oblast", "Vladimir Oblast", "Volgograd Oblast", "Vologda Oblast", "Voronezh Oblast", "Yaroslavl Oblast", "Zabaykalsky Krai", "Adygea Republic", "Altai Krai", "Altai Republic", "Bashkortostan Republic", "Buryatia Republic", "Chechen Republic", "Chuvash Republic", "Dagestan Republic", "Ingushetia Republic", "Kabardino-Balkarian Republic", "Kalmykia Republic", "Karachay-Cherkess Republic", "Karelia Republic", "Komi Republic", "Mari El Republic", "Mordovia Republic", "North Ossetia-Alania Republic", "Tatarstan Republic", "Tuva Republic", "Udmurt Republic"
  //   ]
  // },
  {
    "name": "Rwanda",
    "city": [
      "Eastern Province", "Kigali City", "Northern Province", "Southern Province", "Western Province"
    ]
  },

  {
    "name": "Saint Barthélemy",
    "city": [
      "Gustavia"
    ]
  },
  {
    "name": "Saint Helena, Ascension and Tristan da Cunha",
    "city": [
      "Ascension Island", "Saint Helena Island", "Tristan da Cunha"
    ]
  },
  {
    "name": "Saint Kitts and Nevis",
    "city": [
      "Saint Kitts", "Nevis"
    ]
  },
  {
    "name": "Saint Lucia",
    "city": [
      "Anse la Raye", "Canaries", "Castries", "Choiseul", "Dennery", "Gros Islet", "Laborie", "Micoud", "Soufrière", "Vieux Fort"
    ]
  },
  {
    "name": "Saint Martin (French part)",
    "city": [
      "Marigot"
    ]
  },
  {
    "name": "Saint Pierre and Miquelon",
    "city": [
      "Miquelon-Langlade", "Saint-Pierre"
    ]
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "city": [
      "Charlotte", "Grenadines", "Saint Andrew", "Saint David", "Saint George", "Saint Patrick"
    ]
  },
  {
    "name": "Samoa",
    "city": [
      "A'ana", "Aiga-i-le-Tai", "Atua", "Fa'asaleleaga", "Gaga'emauga", "Gaga'ifomauga", "Palauli", "Satupa'itea", "Tuamasaga", "Va'a-o-Fonoti", "Vaisigano"
    ]
  },
  {
    "name": "San Marino",
    "city": [
      "Acquaviva", "Borgo Maggiore", "Chiesanuova", "Domagnano", "Faetano", "Fiorentino", "Montegiardino", "San Marino Città", "Serravalle"
    ]
  },
  {
    "name": "Sao Tome and Principe",
    "city": [
      "Água Grande", "Cantagalo", "Caué", "Lembá", "Lobata", "Mé-Zóchi", "Pagué (Príncipe)"
    ]
  },
  {
    "name": "Saudi Arabia",
    "city": [
      "Asir", "Al Bahah", "Al Hudud ash Shamaliyah", "Al Jawf", "Al Madinah al Munawwarah", "Al Qasim", "Ar Riyad", "Ash Sharqiyah (Eastern Province)", "Ha'il", "Jizan", "Makkah al Mukarramah", "Najran", "Tabuk"
    ]
  },
  {
    "name": "Senegal",
    "city": [
      "Dakar", "Diourbel", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda", "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda", "Thiès", "Ziguinchor"
    ]
  },
  {
    "name": "Serbia",
    "city": [
      "Belgrade", "Bor District", "Braničevo District", "Central Banat District", "Jablanica District", "Kolubara District", "Mačva District", "Moravica District", "Nišava District", "North Bačka District", "North Banat District", "Pčinja District", "Peć District", "Pirot District", "Podunavlje District", "Pomoravlje District", "Rasina District", "Raška District", "South Bačka District", "South Banat District", "Srem District", "Šumadija District", "Toplica District", "West Bačka District", "Zaječar District", "Zlatibor District"
    ]
  },
  {
    "name": "Seychelles",
    "city": [
      "Anse aux Pins", "Anse Boileau", "Anse Etoile", "Anse Royale", "Au Cap", "Baie Lazare", "Baie Sainte Anne", "Beau Vallon", "Bel Air", "Bel Ombre", "Cascade", "Glacis", "Grand'Anse Mahe", "Grand'Anse Praslin", "La Digue and Inner Islands", "Les Mamelles", "Mont Buxton", "Mont Fleuri", "Plaisance", "Pointe La Rue", "Port Glaud", "Roche Caiman", "Saint Louis", "Takamaka"
    ]
  },
  {
    "name": "Sierra Leone",
    "city": [
      "Eastern", "Northern", "North Western", "Southern", "Western Area"
    ]
  },
  {
    "name": "Singapore",
    "city": [
      "Central Singapore", "North East", "North West", "South East", "South West"
    ]
  },
  {
    "name": "Sint Maarten (Dutch part)",
    "city": [
      "Lower Prince’s Quarter", "Cul de Sac", "Philipsburg", "Simpson Bay", "Cole Bay", "Upper Prince’s Quarter", "Little Bay"
    ]
  },
  {
    "name": "Slovakia",
    "city": [
      "Banská Bystrica Region", "Bratislava Region", "Košice Region", "Nitra Region", "Prešov Region", "Trenčín Region", "Trnava Region", "Žilina Region"
    ]
  },
  {
    "name": "Slovenia",
    "city": [
      "Ajdovščina", "Beltinci", "Bled", "Bohinj", "Borovnica", "Bovec", "Brda", "Brezovica", "Brežice", "Cankova", "Celje", "Cerklje na Gorenjskem", "Cerknica", "Cerkno", "Črenšovci", "Črna na Koroškem", "Črnomelj", "Destrnik", "Divača", "Dobje", "Dobrepolje", "Dobrna", "Dobrova-Polhov Gradec", "Dol pri Ljubljani", "Domžale", "Dornava", "Dravograd", "Duplek", "Gorenja Vas-Poljane", "Gorišnica", "Gornja Radgona", "Gornji Grad", "Gornji Petrovci", "Grad", "Grosuplje", "Hajdina", "Hoče-Slivnica", "Hodoš", "Horjul", "Hrastnik", "Hrpelje-Kozina", "Idrija", "Ig", "Ilirska Bistrica", "Ivančna Gorica", "Izola", "Jesenice", "Jezersko", "Juršinci", "Kamnik", "Kanal", "Kidričevo", "Kobarid", "Kobilje", "Kočevje", "Komen", "Komenda", "Koper", "Kostanjevica na Krki", "Kostel", "Kozje", "Kranj", "Kranjska Gora", "Krško", "Kungota", "Kuzma", "Laško", "Lenart", "Lendava", "Litija", "Ljubljana", "Ljubno", "Ljutomer", "Log-Dragomer", "Logatec", "Loška Dolina", "Loški Potok", "Lovrenc na Pohorju", "Luče", "Lukovica", "Majšperk", "Makole", "Maribor", "Markovci", "Medvode", "Mengeš", "Metlika", "Mežica", "Miklavž na Dravskem Polju", "Miren-Kostanjevica", "Mirna", "Mirna Peč", "Mislinja", "Mokronog-Trebelno", "Moravče", "Moravske Toplice", "Mozirje", "Murska Sobota", "Muta", "Naklo", "Nazarje", "Odranci", "Oplotnica", "Ormož", "Osilnica", "Pesnica", "Piran", "Pivka", "Podčetrtek", "Podlehnik", "Podvelka", "Poljčane", "Polzela", "Postojna", "Prebold", "Preddvor", "Prevalje", "Ptuj", "Puconci", "Rače-Fram", "Radeče", "Radenci", "Radlje ob Dravi", "Radovljica", "Ravne na Koroškem", "Razkrižje", "Renče-Vogrsko", "Rečica ob Savinji", "Ribnica", "Ribnica na Pohorju", "Rogaška Slatina", "Rogašovci", "Rogatec", "Ruše", "Selnica ob Dravi", "Semič", "Sevnica", "Sežana", "Slovenska Bistrica", "Slovenske Konjice", "Šalovci", "Šempeter-Vrtojba", "Šenčur", "Šentilj", "Šentjernej", "Šentjur", "Škocjan", "Škofja Loka", "Škofljica", "Šmarje pri Jelšah", "Šmarješke Toplice", "Šmartno ob Paki", "Šmartno pri Litiji", "Šoštanj", "Štore", "Straža", "Sveti Andraž v Slovenskih goricah", "Sveti Jurij ob Ščavnici", "Sveti Jurij v Slovenskih goricah", "Sveti Tomaž", "Tabor", "Tišina", "Tolmin", "Trbovlje", "Trebnje", "Trnovska Vas", "Trzin", "Tržič", "Turnišče", "Velenje", "Velika Polana", "Velike Lašče", "Veržej", "Videm", "Vipava", "Vitanje", "Vodice", "Vojnik", "Vransko", "Vrhnika", "Vuzenica", "Zagorje ob Savi", "Zavrč", "Zreče", "Žalec", "Železniki", "Žetale", "Žiri", "Žirovnica", "Žužemberk"
    ]
  },
  {
    "name": "Solomon Islands",
    "city": [
      "Central", "Choiseul", "Guadalcanal", "Isabel", "Makira-Ulawa", "Malaita", "Rennell and Bellona", "Temotu", "Western"
    ]
  },
  {
    "name": "Somalia",
    "city": [
      "Awdal", "Bakool", "Banaadir", "Bari", "Bay", "Galguduud", "Gedo", "Hiiraan", "Lower Juba", "Lower Shebelle", "Middle Juba", "Middle Shebelle", "Mudug", "Nugal", "Sanaag", "Sool", "Togdheer", "Woqooyi Galbeed"
    ]
  },
  {
    "name": "South Africa",
    "city": [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"
    ]
  },
  {
    "name": "South Sudan",
    "city": [
      "Central Equatoria", "Eastern Equatoria", "Jonglei", "Lakes", "Northern Bahr el Ghazal", "Unity", "Upper Nile", "Warrap", "Western Bahr el Ghazal", "Western Equatoria"
    ]
  },
  {
    "name": "Spain",
    "city": [
      "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Balearic Islands", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Melilla", "Murcia", "Navarre", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Seville", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
    ]
  },
  {
    "name": "Sri Lanka",
    "city": [
      "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    ]
  },
  {
    "name": "Sudan",
    "city": [
      "Al Jazirah", "Al Qadarif", "Blue Nile", "Central Darfur", "East Darfur", "Kassala", "Khartoum", "North Darfur", "North Kordofan", "Northern", "Red Sea", "River Nile", "Sennar", "South Darfur", "South Kordofan", "West Darfur", "West Kordofan", "White Nile"
    ]
  },
  {
    "name": "Suriname",
    "city": [
      "Brokopondo", "Commewijne", "Coronie", "Marowijne", "Nickerie", "Para", "Paramaribo", "Saramacca", "Sipaliwini", "Wanica"
    ]
  },
  {
    "name": "Svalbard and Jan Mayen",
    "city": [
      "Svalbard", "Jan Mayen"
    ]
  },
  {
    "name": "Sweden",
    "city": [
      "Blekinge", "Dalarna", "Gotland", "Gävleborg", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Örebro", "Östergötland", "Skåne", "Södermanland", "Stockholm", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland"
    ]
  },
  {
    "name": "Switzerland",
    "city": [
      "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt", "Bern", "Fribourg", "Genève", "Glarus", "Graubünden", "Jura", "Luzern", "Neuchâtel", "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau", "Ticino", "Uri", "Vaud", "Valais", "Zug", "Zürich"
    ]
  },
  {
    "name": "Syrian Arab Republic",
    "city": [
      "Al-Hasakah", "Aleppo", "Damascus", "Daraa", "Deir ez-Zor", "Hama", "Homs", "Idlib", "Latakia", "Quneitra", "Raqqa", "Rif Dimashq", "Suwayda", "Tartus"
    ]
  },
  {
    "name": "Taiwan",
    "city": [
      "Changhua", "Chiayi", "Hsinchu", "Hualien", "Kaohsiung", "Keelung", "Kinmen", "Lienchiang", "Miaoli", "Nantou", "New Taipei", "Penghu", "Pingtung", "Taichung", "Tainan", "Taipei", "Taitung", "Taoyuan", "Yilan", "Yunlin"
    ]
  },
  {
    "name": "Tajikistan",
    "city": [
      "Dushanbe", "Gorno-Badakhshan", "Khatlon", "Sughd", "Districts of Republican Subordination"
    ]
  },
  {
    "name": "Tanzania",
    "city": [
      "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pemba North", "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar North", "Zanzibar Central/South", "Zanzibar Urban/West"
    ]
  },
  {
    "name": "Thailand",
    "city": [
      "Amnat Charoen", "Ang Thong", "Bueng Kan", "Buriram", "Chachoengsao", "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chonburi", "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi", "Lampang", "Lamphun", "Loei", "Lopburi", "Mae Hong Son", "Maha Sarakham", "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lam Phu", "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phang Nga", "Phatthalung", "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya", "Phrae", "Phuket", "Prachinburi", "Prachuap Khiri Khan", "Ranong", "Ratchaburi", "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", "Saraburi", "Satun", "Sing Buri", "Sisaket", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", "Trat", "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
    ]
  },
  {
    "name": "Timor-Leste",
    "city": [
      "Aileu", "Ainaro", "Baucau", "Bobonaro", "Cova Lima", "Dili", "Ermera", "Lautém", "Liquiçá", "Manatuto", "Manufahi", "Oecusse", "Viqueque"
    ]
  },
  {
    "name": "Togo",
    "city": [
      "Centrale", "Kara", "Maritime", "Plateaux", "Savanes"
    ]
  },
  {
    "name": "Tokelau",
    "city": [
      "Atafu", "Fakaofo", "Nukunonu"
    ]
  },
  {
    "name": "Tonga",
    "city": [
      "'Eua", "Ha'apai", "Niuas", "Tongatapu", "Vava'u"
    ]
  },
  {
    "name": "Trinidad and Tobago",
    "city": [
      "Arima", "Chaguanas", "Couva-Tabaquite-Talparo", "Diego Martin", "Eastern Tobago", "Mayaro-Rio Claro", "Penal-Debe", "Point Fortin", "Port of Spain", "Princes Town", "San Fernando", "San Juan-Laventille", "Sangre Grande", "Siparia", "Tunapuna-Piarco", "Western Tobago"
    ]
  },
  {
    "name": "Tunisia",
    "city": [
      "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
    ]
  },
  {
    "name": "Turkey",
    "city": [
      "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
    ]
  },
  {
    "name": "Turkmenistan",
    "city": [
      "Ahal", "Ashgabat", "Balkan", "Daşoguz", "Lebap", "Mary"
    ]
  },
  {
    "name": "Turks and Caicos Islands",
    "city": [
      "Grand Turk", "Middle Caicos", "North Caicos", "Providenciales", "Salt Cay", "South Caicos"
    ]
  },
  {
    "name": "Tuvalu",
    "city": [
      "Funafuti", "Nanumanga", "Nanumea", "Niutao", "Nui", "Nukufetau", "Nukulaelae", "Vaitupu"
    ]
  },
  {
    "name": "Uganda",
    "city": [
      "Abim", "Adjumani", "Agago", "Alebtong", "Amolatar", "Amudat", "Amuria", "Amuru", "Apac", "Arua", "Budaka", "Bududa", "Bugiri", "Buhweju", "Buikwe", "Bukedea", "Bukomansimbi", "Bukwo", "Bulambuli", "Buliisa", "Bundibugyo", "Busembatia", "Bushenyi", "Busia", "Butaleja", "Butambala", "Buvuma", "Buyende", "Dokolo", "Gomba", "Gulu", "Hoima", "Ibanda", "Iganga", "Isingiro", "Jinja", "Kaabong", "Kabale", "Kabarole", "Kaberamaido", "Kagadi", "Kakumiro", "Kalangala", "Kaliro", "Kalungu", "Kampala", "Kamuli", "Kamwenge", "Kanungu", "Kapchorwa", "Kasese", "Katakwi", "Kayunga", "Kibaale", "Kiboga", "Kibuku", "Kigezi", "Kiruhura", "Kiryandongo", "Kisoro", "Kitagwenda", "Kitgum", "Koboko", "Kole", "Kotido", "Kumi", "Kween", "Kyankwanzi", "Kyegegwa", "Kyenjojo", "Kyotera", "Lamwo", "Lira", "Luuka", "Luwero", "Lwengo", "Lyantonde", "Manafwa", "Maracha", "Masaka", "Masindi", "Mayuge", "Mbale", "Mbarara", "Mitooma", "Mityana", "Moroto", "Moyo", "Mpigi", "Mubende", "Mukono", "Nabilatuk", "Nakapiripirit", "Nakaseke", "Nakasongola", "Namayingo", "Namisindwa", "Namutumba", "Napak", "Nebbi", "Ngora", "Ntoroko", "Ntungamo", "Nwoya", "Omoro", "Otuke", "Oyam", "Pader", "Pallisa", "Rakai", "Rubanda", "Rubirizi", "Rukungiri", "Rwampara", "Rwenzori", "Serere", "Sheema", "Sironko", "Soroti", "Tororo", "Wakiso", "Yumbe", "Zombo"
    ]
  },
  {
    "name": "Ukraine",
    "city": [
      "Cherkasy", "Chernihiv", "Chernivtsi", "Dnipropetrovsk", "Donetsk", "Ivano-Frankivsk", "Kharkiv", "Kherson", "Khmelnytskyi", "Kyiv", "Kirovohrad", "Luhansk", "Lviv", "Mykolaiv", "Odessa", "Poltava", "Rivne", "Sumy", "Ternopil", "Vinnytsia", "Volyn", "Zakarpattia", "Zaporizhzhia", "Zhytomyr"
    ]
  },
  {
    "name": "United Arab Emirates",
    "city": [
      "Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain"
    ]
  },
  {
    "name": "United Kingdom (England)",
    "city": [
      "Barnsley", "Bath and North East Somerset", "Bedford", "Berkshire", "Birmingham", "Blackburn with Darwen", "Blackpool", "Bolsover", "Bolton", "Bournemouth, Christchurch and Poole", "Bracknell Forest", "Bradford", "Brighton and Hove", "Bristol", "Buckinghamshire", "Bury", "Calderdale", "Cambridgeshire", "Carlisle", "Central Bedfordshire", "Cheshire East", "Cheshire West and Chester", "Cornwall", "County Durham", "Coventry", "Cumbria", "Darlington", "Derby", "Derbyshire", "Devon", "Doncaster", "Dorset", "Dudley", "East Riding of Yorkshire", "East Staffordshire", "East Sussex", "Epping Forest", "Epsom and Ewell", "Essex", "Exeter", "Folkestone and Hythe", "Gateshead", "Gloucestershire", "Halton", "Hampshire", "Hartlepool", "Herefordshire", "Hertfordshire", "Isle of Wight", "Isles of Scilly", "Kent", "Kingston upon Hull", "Kirklees", "Knowsley","Lancashire", "Leeds", "Leicester", "Leicestershire", "Lincolnshire", "Liverpool","London", "Luton", "Manchester", "Medway", "Middlesbrough", "Milton Keynes", "Newcastle upon Tyne", "Norfolk", "North East Lincolnshire", "North Lincolnshire", "North Norfolk", "North Northamptonshire", "North Somerset", "North Tyneside", "North Yorkshire", "Northamptonshire", "Northumberland", "Nottingham", "Nottinghamshire", "Oldham", "Oxfordshire", "Peterborough", "Plymouth", "Portsmouth", "Reading", "Redcar and Cleveland", "Rochdale", "Rotherham", "Rutland", "Salford", "Sandwell", "Sefton", "Sheffield", "Shropshire", "Slough", "Solihull", "Somerset", "South Gloucestershire", "South Tyneside", "Southampton", "Southend-on-Sea", "St. Helens", "Staffordshire", "Stockport", "Stockton-on-Tees", "Stoke-on-Trent", "Suffolk", "Sunderland", "Surrey", "Swindon", "Tameside", "Telford and Wrekin", "Thurrock", "Torbay", "Trafford", "Wakefield", "Walsall", "Warrington", "Warwickshire", "West Berkshire", "West Midlands", "West Northamptonshire", "West Sussex", "Wigan", "Wiltshire", "Windsor and Maidenhead", "Wirral", "Wokingham", "Wolverhampton", "Worcestershire", "York"
    ]
  },
  {
    "name": "United Kingdom (Northern Ireland)",
    "city": [
      "Antrim and Newtownabbey", "Ards and North Down", "Armagh City, Banbridge and Craigavon", "Belfast City", "Causeway Coast and Glens", "Derry City and Strabane", "Fermanagh and Omagh", "Lisburn and Castlereagh", "Mid and East Antrim", "Mid Ulster", "Newry, Mourne and Down"
    ]
  },
  {
    "name": "United Kingdom (Scotland)",
    "city": [
      "Aberdeen", "Aberdeenshire", "Angus", "Argyll and Bute", "Clackmannanshire", "Dumfries and Galloway", "Dundee City", "East Ayrshire", "East Dunbartonshire", "East Lothian", "East Renfrewshire", "Edinburgh", "Eilean Siar", "Falkirk", "Fife", "Glasgow City", "Highland", "Inverclyde", "Midlothian", "Moray", "Na h-Eileanan Siar", "North Ayrshire", "North Lanarkshire", "Orkney Islands", "Perth and Kinross", "Renfrewshire", "Scottish Borders", "Shetland Islands", "South Ayrshire", "South Lanarkshire", "Stirling", "West Dunbartonshire", "West Lothian"
    ]
  },
  {
    "name": "United Kingdom (Wales)",
    "city": [
      "Blaenau Gwent", "Bridgend", "Caerphilly", "Cardiff", "Carmarthenshire", "Ceredigion", "Conwy", "Denbighshire", "Flintshire", "Gwynedd", "Isle of Anglesey", "Merthyr Tydfil", "Monmouthshire", "Neath Port Talbot", "Newport", "Pembrokeshire", "Powys", "Rhondda Cynon Taf", "Swansea", "Torfaen", "Vale of Glamorgan", "Wrexham"
    ]
  },
  {
    "name": "United States of America",
    "city": [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "American Samoa", "Guam", "Northern Mariana Islands", "Puerto Rico", "U.S. Virgin Islands"
    ]
  },
  {
    "name": "Uruguay",
    "city": [
      "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
    ]
  },
  {
    "name": "Uzbekistan",
    "city": [
      "Andijan", "Bukhara", "Fergana", "Jizzakh", "Karakalpakstan", "Kashkadarya", "Khorezm", "Namangan", "Navoiy", "Samarkand", "Sirdaryo", "Surkhandarya", "Tashkent", "Tashkent City"
    ]
  },
  {
    "name": "Vanuatu",
    "city": [
      "Malampa", "Penama", "Sanma", "Shefa", "Tafea", "Torba"
    ]
  },
  {
    "name": "Venezuela",
    "city": [
      "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Falcón", "Federal Dependencies", "Guárico", "La Guaira", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Yaracuy", "Zulia"
    ]
  },
  {
    "name": "Viet Nam",
    "city": [
      "An Giang", "Bà Rịa-Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hồ Chí Minh", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên-Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
    ]
  },
  {
    "name": "Wallis and Futuna",
    "city": [
      "Alo", "Sigave", "Uvea"
    ]
  },
  {
    "name": "Western Sahara",
    "city": [
      "Boujdour", "Dakhla-Oued Ed-Dahab", "Es Semara", "Laâyoune"
    ]
  },
  {
    "name": "Yemen",
    "city": [
      "Abyan", "Aden", "Al Bayda", "Al Dhale'e", "Al Hudaydah", "Al Jawf", "Al Mahrah", "Al Mahwit", "Amanat Al Asimah", "Dhamar", "Hadramaut", "Hajjah", "Ibb", "Lahij", "Ma'rib", "Raymah", "Saada", "Sana'a", "Shabwah", "Socotra", "Taiz"
    ]
  },
  {
    "name": "Zambia",
    "city": [
      "Central", "Copperbelt", "Eastern", "Luapula", "Lusaka", "Muchinga", "Northern", "North-Western", "Southern", "Western"
    ]
  },
  {
    "name": "Zimbabwe",
    "city": [
      "Bulawayo", "Harare", "Manicaland", "Mashonaland Central", "Mashonaland East", "Mashonaland West", "Masvingo", "Matabeleland North", "Matabeleland South", "Midlands"
    ]
  }
]




export const AllCommittee: any[] = [
  {
    id: 1,
    name: "National Standing Committee",
    nameBn: "জাতীয় স্থায়ী কমিটি",
    designation: [
      {
        id: "1",
        name: "Chairperson",
        nameBn: "চেয়ারপার্সন ",
        amount: 1000,
        amountBn: "১০০০",
      },
      {
        id: "2",
        name: "Chairman",
        nameBn: "চেয়ারম্যান",
        amount: 1000,
        amountBn: "১০০০",
      },
      {
        id: "3",
        name: "Member",
        nameBn: "সদস্য",
        amount: 1000,
        amountBn: "১০০০",
      }

    ]
  },
  {
    id: 2,
    name: "Advisory Council of Chairman",
    nameBn: "চেয়ারম্যানের উপদেষ্টা কাউন্সিল",
    designation: [
      {
        id: "1",
        name: "Member",
        nameBn: "সদস্য",
        amount: 500,
        amountBn: "৫০০",
      }

    ]
  },
  {
    id: 3,
    name: "National Executive Committee",
    nameBn: "জাতীয় নির্বাহী কমিটি",
    designation: [
      {
        id: "1",
        name: "Chairperson",
        nameBn: "চেয়ারপার্সন",
        amount: 1000,
        amountBn: "১০০০",
      },
      {
        id: "2",
        name: "Senior Vice Chairman",
        nameBn: "সিনিয়র ভাইস চেয়ারম্যান",
        amount: 1000,
        amountBn: "১০০০",
      },
      {
        id: "3",
        name: "Vice-Chairman",
        nameBn: "ভাইস চেয়ারম্যান",
        amount: 500,
        amountBn: "৫০০",
      },
      {
        id: "4",
        name: "Secretary General",
        nameBn: "মহাসচিব",
        amount: 1000,
        amountBn: "১০০০",
      },
       {
        id: "5",
        name: "Senior Joint Secretary General",
        nameBn: "সিনিয়র যুগ্ম মহাসচিব",
        amount: 1000,
        amountBn: "১০০০",
      },
      {
        id: "6",
        name: "Joint Secretary General",
        nameBn: "যুগ্মমহাসচিব",
        amount: 300,
        amountBn: "৩০০",
      },
      {
        id: "7",
        name: "Treasurer",
        nameBn: "কোষাধ্যক্ষ",
        amount: 300,
        amountBn: "৩০০",
      },
      {
        id: "8",
        name: "Secretary",
        nameBn: "সম্পাদক",
        amount: 300,
        amountBn: "৩০০",
      },
      {
        id: "9",
        name: "Assistant Secretary",
        nameBn: "সহ-সম্পাদক",
        amount: 300,
        amountBn: "৩০০",
      },
      {
        id: "10",
        name: "Executive Members",
        nameBn: "নির্বাহীসদস্য",
        amount: 100,
        amountBn: "১০০",
      }

    ]
  },
  {
    id: 4,
    name: "District Executive Committee",
    nameBn: "জেলা নির্বাহী কমিটি",
    designation: [
      {
        id: "1",
        name: " President",
        nameBn: "সভাপতি",
        amount: 500,
        amountBn: "৫০০",
      },
      {
        id: "2",
        name: "Vice President",
        nameBn: "সহ-সভাপতি",
        amount: 300,
        amountBn: "৩০০",
      },
      {
        id: "3",
        name: "General Secretary",
        nameBn: "সাধারণ সম্পাদক",
        amount: 500,
        amountBn: "৫০০",
      },
      {
        id: "4",
        name: "Joint-General Secretary",
        nameBn: "যুগ্ম-সাধারণ সম্পাদক",
        amount: 300,
        amountBn: "৩০০",
      },
      {
        id: "5",
        name: "Secretaries",
        nameBn: "সম্পাদকগণ",
        amount: 200,
        amountBn: "২০০",
      },
      {
        id: "6",
        name: " Joint-Secretaries",
        nameBn: "সহ-সম্পাদকগণ",
        amount: 100,
        amountBn: "১০০",
      },
      {
        id: "7",
        name: "Executive Members",
        nameBn: "নির্বাহী সদস্য",
        amount: 50,
        amountBn: "৫০",
      }

    ]
  },
  {
    id: 5,
    name: "Metropolitan Executive Committee",
    nameBn: "মহানগর নির্বাহী কমিটি",
    designation: [
      {
        id: "1",
        name: " President",
        nameBn: "সভাপতি",
        amount: 400,
        amountBn: "৪০০",
      },
      {
        id: "2",
        name: "Vice President",
        nameBn: "সহ-সভাপতি",
        amount: 200,
        amountBn: "২০০",
      },
      {
        id: "3",
        name: "General Secretary",
        nameBn: "সাধারণ সম্পাদক",
        amount: 400,
        amountBn: "৪০০",
      },
      {
        id: "4",
        name: "Joint-General Secretary",
        nameBn: "যুগ্ম-সাধারণ সম্পাদক",
        amount: 200,
        amountBn: "২০০",
      },
      {
        id: "5",
        name: "Secretaries",
        nameBn: "সম্পাদকগণ",
        amount: 150,
        amountBn: "১৫০",
      },
      {
        id: "6",
        name: " Joint-Secretaries",
        nameBn: "সহ-সম্পাদকগণ",
        amount: 100,
        amountBn: "১০০",
      },
      {
        id: "7",
        name: "Executive Members",
        nameBn: "নির্বাহী সদস্য",
        amount: 40,
        amountBn: "৪০",
      }


    ]
  },
  {
    id: 6,
    name: "Upazila/Thana/Municipality",
    nameBn: "উপজেলা/থানা/পৌরসভা",
    designation: [
      {
        id: "1",
        name: " President",
        nameBn: "সভাপতি",
        amount: 400,
        amountBn: "৪০০",
      },
      {
        id: "2",
        name: "Vice President",
        nameBn: "সহ-সভাপতি",
        amount: 200,
        amountBn: "২০০",
      },
      {
        id: "3",
        name: "General Secretary",
        nameBn: "সাধারণ সম্পাদক",
        amount: 400,
        amountBn: "৪০০",
      },
      {
        id: "4",
        name: "Joint-General Secretary",
        nameBn: "যুগ্ম-সাধারণ সম্পাদক",
        amount: 200,
        amountBn: "২০০",
      },
      {
        id: "5",
        name: "Secretaries",
        nameBn: "সম্পাদকগণ",
        amount: 150,
        amountBn: "১৫০",
      },
      {
        id: "6",
        name: " Joint-Secretaries",
        nameBn: "সহ-সম্পাদকগণ",
        amount: 100,
        amountBn: "১০০",
      },
      {
        id: "7",
        name: "Executive Members",
        nameBn: "নির্বাহী সদস্য",
        amount: 40,
        amountBn: "৪০",
      },

    ]
  },

  {
    id: 7,
    name: "Union and Municipality Ward",
    nameBn: "ইউনিয়ন এবং পৌর/মহানগর ওয়ার্ড",
    designation: [
      {
        id: "1",
        name: " President",
        nameBn: "সভাপতি",
        amount: 100,
        amountBn: "১০০",
      },
      {
        id: "2",
        name: "Vice President",
        nameBn: "সহ-সভাপতি",
        amount: 50,
        amountBn: "৫০",
      },
      {
        id: "3",
        name: "General Secretary",
        nameBn: "সাধারণ সম্পাদক",
        amount: 100,
        amountBn: "১০০",
      },
      {
        id: "4",
        name: "Joint-General Secretary",
        nameBn: "যুগ্ম-সাধারণ সম্পাদক",
        amount: 50,
        amountBn: "৫০",
      },
      {
        id: "5",
        name: "Secretaries",
        nameBn: "সম্পাদকগণ",
        amount: 40,
        amountBn: "৪০",
      },
      {
        id: "6",
        name: " Joint-Secretaries",
        nameBn: "সহ-সম্পাদকগণ",
        amount: 30,
        amountBn: "৩০",
      },
      {
        id: "7",
        name: "Executive Members",
        nameBn: "নির্বাহী সদস্য",
        amount: 20,
        amountBn: "২০",
      }


    ]
  },
  {
    id: 8,
    name: "Union Ward",
    nameBn: "ইউনিয়ন ওয়ার্ড",
    designation: [
      {
        id: "1",
        name: " President",
        nameBn: "সভাপতি",
        amount: 50,
        amountBn: "৫০",
      },
      {
        id: "2",
        name: "Vice President",
        nameBn: "সহ-সভাপতি",
        amount: 40,
        amountBn: "৪০",
      },
      {
        id: "3",
        name: "General Secretary",
        nameBn: "সাধারণ সম্পাদক",
        amount: 50,
        amountBn: "৫০",
      },
      {
        id: "4",
        name: "Joint-General Secretary",
        nameBn: "যুগ্ম-সাধারণ সম্পাদক",
        amount: 40,
        amountBn: "৪০",
      },
      {
        id: "5",
        name: "Secretaries",
        nameBn: "সম্পাদকগণ",
        amount: 30,
        amountBn: "৩০",
      },
      {
        id: "6",
        name: " Joint-Secretaries",
        nameBn: "সহ-সম্পাদকগণ",
        amount: 20,
        amountBn: "২০",
      },
      {
        id: "7",
        name: "Executive Members",
        nameBn: "নির্বাহী সদস্য",
        amount: 10,
        amountBn: "১০",
      }

    ]
  },
]
