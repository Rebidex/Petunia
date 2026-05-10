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
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: ionId,
      name: 'Ion Popescu',
      email: 'ion@test.com',
      password: clientPassword1,
      role: 'client',
      createdAt: new Date().toISOString()
    },
    {
      id: mariaId,
      name: 'Maria Ionescu',
      email: 'maria@test.com',
      password: clientPassword2,
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
    description: '12 trandafiri rosii cu eucalipt proaspat',
    price: 89.99,
    category: 'trandafiri',
    imageUrl: 'https://source.unsplash.com/800x600/?rose,bouquet',
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
    imageUrl: 'https://source.unsplash.com/800x600/?tulips,flowers',
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
    imageUrl: 'https://source.unsplash.com/800x600/?white-flowers,bouquet',
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
    imageUrl: 'https://source.unsplash.com/800x600/?peonies',
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
    imageUrl: 'https://source.unsplash.com/800x600/?chrysanthemum,flowers',
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
    imageUrl: 'https://source.unsplash.com/800x600/?iris,flower',
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
    imageUrl: 'https://source.unsplash.com/800x600/?eucalyptus,flowers',
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
    imageUrl: 'https://source.unsplash.com/800x600/?flower-arrangement',
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
    imageUrl: 'https://source.unsplash.com/800x600/?monstera,plant',
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
    imageUrl: 'https://source.unsplash.com/800x600/?colorful-flowers,bouquet',
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
