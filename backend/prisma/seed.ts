import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const passwordHash = await bcrypt.hash('admin', 10)

    await prisma.user.upsert({
        where: { email: 'admin@gteck.com' },
        update: {},
        create: {
        name: 'Admin Gteck',
        email: 'admin@gteck.com',
        password: passwordHash, 
        },
    })

    await prisma.campaign.createMany({
    data: [
      { name: 'Black Friday 2025', cost: 5000, revenue: 15000, tax: 500, expense: 200 },
      { name: 'Natal Promocional', cost: 3000, revenue: 12000, tax: 300, expense: 150 },
      { name: 'Queima de Estoque', cost: 1000, revenue: 800 },
      { name: 'Lançamento Coleção Outono', cost: 2500, revenue: 7000, tax: 200 },
      { name: 'Google Ads - Institucional', cost: 500, revenue: 600 },
      { name: 'Influenciadores Verão', cost: 8000, revenue: 25000, tax: 800, expense: 1000 },
      { name: 'Retargeting Facebook', cost: 1200, revenue: 4000, expense: 50 },
      { name: 'E-mail Marketing Semanal', cost: 100, revenue: 1500 },
      { name: 'Sorteio Instagram', cost: 400, revenue: 0 },
      { name: 'Youtube Ads - Vídeo 1', cost: 2000, revenue: 5500, tax: 150, expense: 80 },
    ]
  })

  console.log('Seed concluída: 1 usuário admin e 10 campanhas criadas.')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
