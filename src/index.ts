import { arge } from 'arge'
import { config } from 'dotenv'
import { RingApi } from 'ring-client-api'

import type { LocationModeInput } from 'ring-client-api'

config()

interface Mode {
  mode: LocationModeInput
}

const ringApi = new RingApi({
  refreshToken: `${process.env.RING_REFRESH_TOKEN}`,
})

async function main() {
  const { mode } = arge<Mode>(process.argv)

  const locations = await ringApi.getLocations()

  await Promise.all(locations.map(location => location.setLocationMode(mode)))

  process.exit()
}

main()
