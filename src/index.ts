import { readFile, writeFile } from 'fs/promises'

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

  ringApi.onRefreshTokenUpdated.subscribe(
    async ({ newRefreshToken, oldRefreshToken }) => {
      if (!oldRefreshToken) {
        return
      }

      const currentConfig = await readFile('.env')
      const updatedConfig = currentConfig
        .toString()
        .replace(oldRefreshToken, newRefreshToken)

      await writeFile('.env', updatedConfig)
    }
  )

  await Promise.all(locations.map(location => location.setLocationMode(mode)))

  process.exit()
}

main()
