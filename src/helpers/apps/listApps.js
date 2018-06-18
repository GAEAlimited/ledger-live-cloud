// @flow
import axios from 'axios'

import { MANAGER_API_BASE } from 'config/constants'

export default async (targetId: string | number) => {
  try {
    const { data: deviceData } = await axios.get(
      `${MANAGER_API_BASE}/device_versions_target_id/${targetId}`,
    )
    const { data } = await axios.get('https://api.ledgerwallet.com/update/applications')

    if (deviceData.name in data) {
      return data[deviceData.name]
    }

    return data['nanos-1.4']
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
