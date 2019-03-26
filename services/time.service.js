import formatDistance from 'date-fns/formatDistance'
import format from 'date-fns/format'
import locale from 'date-fns/locale/vi'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import isValid from 'date-fns/isValid'
import compareAsc from 'date-fns/compareAsc'

export default function fromNow(date) {
	return formatDistance(new Date(date), new Date(), {addSuffix: true, locale: locale})
}

export function formatDate(date, name='dd/MM/yyyy') {
	return format(new Date(date), name)
}

export function distanceFromHours(dateEarlier, dateLater){
	return differenceInHours(dateLater, new Date(dateEarlier))
}

export function distanceFromDays(dateEarlier, dateLater){
	return differenceInDays(dateLater, new Date(dateEarlier))
}

export function isValidDate(date){
  return isValid(new Date(date))
}

export function compareDate(dateLeft, dateRight){
  return compareAsc(new Date(dateLeft), new Date(dateRight))
}
