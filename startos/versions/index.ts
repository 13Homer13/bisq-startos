import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_1_10_9_2 } from './v1.10.9_2'
import { v_1_10_3_1 } from './v1.10.3_1'
import { v_1_10_9_1 } from './v1.10.9_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_1_10_9_2, v_1_10_9_1, v_1_10_3_1],
})
