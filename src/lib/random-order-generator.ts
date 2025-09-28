import { Faker } from "@faker-js/faker"
import { en_IN } from "@faker-js/faker"

export function getRandomOrder() {
const faker = new Faker({ locale: [en_IN] })
  const name = faker.person.firstName()
  const city = faker.location.city()
  const product = ["Mini Lamp", "Cute Notebook", "Korean Mug", "Sticker Pack", "Desk Plant"][
    Math.floor(Math.random() * 5)
  ]

  return `${name} from ${city} just purchased a ${product}! 🛒`
}
