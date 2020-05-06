import React, {useState} from 'react'
import {AutoRefresh, TimeRange} from 'src/types'
import {DEFAULT_TIME_RANGE} from 'src/shared/constants/timeRanges'
import {AUTOREFRESH_DEFAULT} from 'src/shared/constants'

export interface TimeBlock {
  range: TimeRange
  refresh: AutoRefresh
}

export interface TimeContext {
  [key: string]: TimeBlock
}

export const DEFAULT_CONTEXT = {
  new: {
    range: DEFAULT_TIME_RANGE,
    refresh: AUTOREFRESH_DEFAULT,
  },
}

export const TimeContext = React.createContext<TimeContext>(DEFAULT_CONTEXT)

export const TimeProvider: FC = ({children}) => {
  const [timeContext, setTimeContext] = useState(DEFAULT_CONTEXT)

  function addTimeContext(id: string, block?: TimeBlock) {
    setTimeContext(ranges => {
      if (ranges.hasOwnProperty(id)) {
        throw new Error(
          `TimeContext[${id}] already exists: use updateContext instead`
        )
        return ranges
      }
      return {
        ...ranges,
        [id]: {...(block || DEFAULT_CONTEXT['new'])},
      }
    })
  }

  function updateTimeContext(id: string, block: TimeBlock) {
    setTimeContext(ranges => {
      return {
        ...ranges,
        [id]: {...block},
      }
    })
  }

  function removeTimeContext(id: string) {
    setTimeContext(ranges => {
      delete ranges[id]
      return {...ranges}
    })
  }

  return (
    <TimeContext.Provider
      value={{
        timeContext,
        addTimeContext,
        updateTimeContext,
        removeTimeContext,
      }}
    >
      {children}
    </TimeContext.Provider>
  )
}