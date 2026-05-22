import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { db } from './db/index.js'

const createUsers = async () => {
  const [adminPassword, clientPassword1, clientPassword2] = await Promise.all([
    bcrypt.hash('Admin123!', 10),
    bcrypt.hash('Test123!', 10),
    bcrypt.hash('Test123!', 10)
  ])

  const adminId = uuidv4()
  const ionId = uuidv4()
  const mariaId = uuidv4()

  const users = [
    {
      id: adminId,
      name: 'Admin Petunia',
      email: 'admin@florishop.me',
      password: adminPassword,
      phone: '',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: ionId,
      name: 'Ion Popescu',
      email: 'ion@test.com',
      password: clientPassword1,
      phone: '',
      role: 'client',
      createdAt: new Date().toISOString()
    },
    {
      id: mariaId,
      name: 'Maria Ionescu',
      email: 'maria@test.com',
      password: clientPassword2,
      phone: '',
      role: 'client',
      createdAt: new Date().toISOString()
    }
  ]

  return { users, adminId, ionId, mariaId }
}

const createProducts = () => [
  {
    id: uuidv4(),
    name: 'Buchet Petunia Romantic',
    description: '11 trandafiri rosii cu eucalipt proaspat',
    price: 89.99,
    category: 'trandafiri',
    imageUrl: 'https://www.floridelux.ro/storage/app/uploads/public/675/6c4/ca2/thumb_103332_700_0_0_0_auto.jpg',
    stock: 15,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Buchet Primavara Pastel',
    description: 'Mix de lalele si gypsophila',
    price: 74.5,
    category: 'lalele',
    imageUrl: 'https://www.magnolia.ro/storage/app/uploads/public/681/9b2/86d/thumb_214860_700_0_0_0_auto.jpg',
    stock: 20,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Buchet White Grace',
    description: 'Trandafiri albi si irisi intr-un ambalaj ivoire',
    price: 96,
    category: 'mix',
    imageUrl: 'https://iflori.ro/wp-content/uploads/2024/01/white-roses-with-iris-bouquet-527035.jpg',
    stock: 8,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Bujori Deluxe',
    description: 'Bujori premium in nuante blush',
    price: 129,
    category: 'bujori',
    imageUrl: 'https://avenuedesroses.ro/wp-content/uploads/2023/02/buchet-101-bujori-.jpg',
    stock: 10,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Crizanteme vesele',
    description: 'Aranjament colorat pentru orice ocazie',
    price: 59.99,
    category: 'crizanteme',
    imageUrl: 'https://www.baiatulcuflori.ro/pub/media/wysiwyg/buchet-de-crizanteme-autumn-spirit.jpg',
    stock: 25,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Iris Royal Blue',
    description: 'Iriși albastri cu accent natural verde',
    price: 69,
    category: 'iris',
    imageUrl: 'https://www.prietenulgradinii.ro/cdn/products/bulb-iris-albastru-galben-pitic-bleumarin-bip002-6145.webp',
    stock: 18,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Eucalipt Fresh Touch',
    description: 'Aranjament minimalist cu eucalipt si flori albe',
    price: 54,
    category: 'verdeata',
    imageUrl: 'https://s13emagst.akamaized.net/products/91446/91445665/images/res_302acd0d7b2eda92153584a43202d41d.jpg',
    stock: 30,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Buchet Sunset',
    description: 'Mix de trandafiri, lalele si crizanteme in tonuri calde',
    price: 99.5,
    category: 'mix',
    imageUrl: 'https://s13emagst.akamaized.net/products/13315/13314410/images/res_0bc39eb706184f776374b6bb9d4f5e93.jpg',
    stock: 12,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Planta in ghiveci Monstera',
    description: 'Planta decorativa pentru interior',
    price: 110,
    category: 'plante',
    imageUrl: 'https://s13emagst.akamaized.net/products/68060/68059414/images/res_3ed7cda9af334d44e6e0e634c6ad4d71.png',
    stock: 7,
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Buchet Festival',
    description: 'Compozitie exuberanta pentru evenimente',
    price: 145,
    category: 'mix',
    imageUrl: 'https://gomagcdn.ro/domains/alteflori.ro/files/product/original/buchet-de-festival-335024.png',
    stock: 6,
    isAvailable: true,
    createdAt: new Date().toISOString()
  }
]

const createOrders = (ionId, mariaId, products) => [
  {
    id: uuidv4(),
    userId: ionId,
    customerName: 'Ion Popescu',
    customerPhone: '0742000000',
    deliveryAddress: 'Str. Florilor 12, Cluj-Napoca',
    deliveryDate: '2026-06-15',
    items: [
      {
        productId: products[0].id,
        name: products[0].name,
        price: products[0].price,
        quantity: 2
      }
    ],
    totalPrice: Number((products[0].price * 2).toFixed(2)),
    status: 'pending',
    note: 'Adaugati un mesaj de la multi ani.',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    userId: mariaId,
    customerName: 'Maria Ionescu',
    customerPhone: '0733000000',
    deliveryAddress: 'Bd. Republicii 100, Bucuresti',
    deliveryDate: '2026-06-18',
    items: [
      {
        productId: products[3].id,
        name: products[3].name,
        price: products[3].price,
        quantity: 1
      }
    ],
    totalPrice: products[3].price,
    status: 'confirmed',
    note: '',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    userId: ionId,
    customerName: 'Ion Popescu',
    customerPhone: '0742000000',
    deliveryAddress: 'Str. Dacia 20, Iasi',
    deliveryDate: '2026-06-20',
    items: [
      {
        productId: products[1].id,
        name: products[1].name,
        price: products[1].price,
        quantity: 1
      },
      {
        productId: products[4].id,
        name: products[4].name,
        price: products[4].price,
        quantity: 1
      }
    ],
    totalPrice: Number((products[1].price + products[4].price).toFixed(2)),
    status: 'delivered',
    note: 'Livrare dupa ora 16:00',
    createdAt: new Date().toISOString()
  }
]

const createBouquets = (ionId, mariaId) => [
  {
    id: uuidv4(),
    userId: ionId,
    name: 'Buchetul meu special',
    flowers: [
      { flower: 'Trandafir rosu', quantity: 5, color: '#e63946' },
      { flower: 'Lalele albe', quantity: 3, color: '#f1faee' }
    ],
    wrapColor: '#a8dadc',
    totalStems: 8,
    estimatedPrice: 65,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    userId: mariaId,
    name: 'Buchet elegant',
    flowers: [
      { flower: 'Bujor', quantity: 4, color: '#ffb4a2' },
      { flower: 'Iris', quantity: 2, color: '#7b2cbf' },
      { flower: 'Eucalipt', quantity: 3, color: '#84a98c' }
    ],
    wrapColor: '#f7cad0',
    totalStems: 9,
    estimatedPrice: 60,
    createdAt: new Date().toISOString()
  }
]

const runSeed = async () => {
  const { users, ionId, mariaId } = await createUsers()
  const products = createProducts()
  const orders = createOrders(ionId, mariaId, products)
  const bouquets = createBouquets(ionId, mariaId)

  db.data = {
    users,
    products,
    orders,
    bouquets
  }

  await db.write()

  console.log('Seed complet pentru Petunia:')
  console.log(`- users: ${users.length}`)
  console.log(`- products: ${products.length}`)
  console.log(`- orders: ${orders.length}`)
  console.log(`- bouquets: ${bouquets.length}`)
}

runSeed().catch((error) => {
  console.error('Eroare la seed:', error)
  process.exit(1)
})
