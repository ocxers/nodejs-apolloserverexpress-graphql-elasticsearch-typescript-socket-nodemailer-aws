import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Method: getNewYorkTime
 *
 * Type: Function
 *
 * Parameters:
 * None
 *
 * Description:
 * This function returns the current Unix timestamp of the 'America/New_York' timezone.
 *
 * Operations:
 * 1. Get the current date and time in the 'America/New_York' timezone using the dayjs library.
 * 2. Format the current date as 'YYYY-MM-DD'.
 * 3. Convert the formatted date to a Unix timestamp in the 'America/New_York' timezone.
 * 4. Return the Unix timestamp.
 *
 * Dependencies:
 * - dayjs library
 */
export const getNewYorkTime = (): number => {
  const nyTime = dayjs.tz(new Date(), 'America/New_York').format('YYYY-MM-DD')
  return dayjs.tz(nyTime, 'America/New_York').valueOf()
}
