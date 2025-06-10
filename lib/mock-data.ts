export function generateMockProducts() {
  const categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden', 'Sports', 'Books']
  const productNames = {
    Electronics: ['Smartphone', 'Laptop', 'Headphones', 'Smart Watch', 'Tablet', 'Camera'],
    Clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Sneakers', 'Dress', 'Hat'],
    'Food & Beverages': ['Coffee', 'Tea', 'Chocolate', 'Snacks', 'Energy Drink', 'Juice'],
    'Home & Garden': ['Lamp', 'Chair', 'Table', 'Plant Pot', 'Cushion', 'Mirror'],
    Sports: ['Football', 'Basketball', 'Tennis Racket', 'Yoga Mat', 'Dumbbells', 'Running Shoes'],
    Books: ['Fiction Novel', 'Business Book', 'Cookbook', 'Biography', 'Science Book', 'Art Book']
  }

  const products = []

  for (const category of categories) {
    const categoryProducts = productNames[category as keyof typeof productNames]

    for (let i = 0; i < categoryProducts.length; i++) {
      const product = categoryProducts[i]
      const price = Math.floor(Math.random() * 1000) + 10
      const stockQty = Math.floor(Math.random() * 200)
      const reorderLevel = Math.floor(Math.random() * 50) + 10

      products.push({
        name: `${product} ${i + 1}`,
        sku: `${category.substring(0, 3).toUpperCase()}-${Date.now()}-${i}`,
        category,
        price: price.toString(),
        stockQty,
        reorderLevel,
        status: stockQty === 0 ? 'Out of Stock' : stockQty < reorderLevel ? 'Low Stock' : 'Active'
      })
    }
  }

  return products
}

export function generateMockCustomers() {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Lisa', 'Robert', 'Mary']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']

  const customers = []

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const domain = domains[Math.floor(Math.random() * domains.length)]

    customers.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Elm', 'Pine', 'Maple'][Math.floor(Math.random() * 5)]} Street, City, State ${Math.floor(Math.random() * 90000) + 10000}`
    })
  }

  return customers
}
