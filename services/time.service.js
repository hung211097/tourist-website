import formatDistance from 'date-fns/formatDistance'
import format from 'date-fns/format'
import locale from 'date-fns/locale/vi'
import differenceInHours from 'date-fns/differenceInHours'

export default function fromNow(date) {
	return formatDistance(new Date(date), new Date(), {addSuffix: true, locale: locale})
}

export function formatDate(date, name='dd/MM/yyyy') {
	return format(new Date(date), name)
}

export function distanceFromHours(dateEarlier, dateLater){
	return differenceInHours(dateLater, new Date(dateEarlier))
}
