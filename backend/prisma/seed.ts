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
      { nome: 'Black Friday 2025', custo: 5000, receita: 15000, taxas: 500, despesas: 200 },
      { nome: 'Natal Promocional', custo: 3000, receita: 12000, taxas: 300, despesas: 150 },
      { nome: 'Queima de Estoque', custo: 1000, receita: 800 },
      { nome: 'Lançamento Coleção Outono', custo: 2500, receita: 7000, taxas: 200 },
      { nome: 'Google Ads - Institucional', custo: 500, receita: 600 },
      { nome: 'Influenciadores Verão', custo: 8000, receita: 25000, taxas: 800, despesas: 1000 },
      { nome: 'Retargeting Facebook', custo: 1200, receita: 4000, despesas: 50 },
      { nome: 'E-mail Marketing Semanal', custo: 100, receita: 1500 },
      { nome: 'Sorteio Instagram', custo: 400, receita: 0 },
      { nome: 'Youtube Ads - Vídeo 1', custo: 2000, receita: 5500, taxas: 150, despesas: 80 },
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
