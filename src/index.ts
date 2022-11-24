import { arge } from 'arge'
import { config } from 'dotenv'
import { RingApi } from 'ring-client-api'

import type { LocationModeInput } from 'ring-client-api'

config()

const ringApi = new RingApi({
  refreshToken: `${process.env.RING_REFRESH_TOKEN}`,
})

async function main() {
  const locations = await ringApi.getLocations()
  const location = locations[0]

  const { mode } = arge(process.argv)

  await location.setLocationMode(mode as LocationModeInput)

  process.exit()
}

main()
