const APP_URL = process.env.APP_URL
import _ from 'lodash'
import ReactHtmlParser from 'react-html-parser'
import { transports } from '../constants/map-option'
import { getLocalStorag } from './local-storage.service'
import { KEY } from '../constants/local-storage'
import { lng, mainCategoriesList } from '../constants'
import { distanceFromDays } from './time.service'

export function isServer() {
  return typeof window === 'undefined'
}

export function convertFullUrl(url) {
  return `${APP_URL}` + url;
}

export function moveToElementId(element) {
  const elm = document.getElementById(element)
  window.scrollTo({
    top: _getElementOffset(elm).top,
    behavior: 'smooth'
  })
}

function _getElementOffset(el) {
  let top = 0
  let left = 0
  let element = el

  // Loop through the DOM tree
  // and add it's parent's offset to get page offset
  do {
    top += element.offsetTop || 0
    left += element.offsetLeft || 0
    element = element.offsetParent
  } while (element)

  top -= 100
  return {
    top,
    left
  }
}

export function blogTitleString(title, stripLength = 8) {
  if (!stripLength) {
    return title
  }
  let tokens = title.split(' ')
  tokens = tokens.splice(0, stripLength)
  return ReactHtmlParser(tokens.join(' ') + '...')
}

export function processMathRoundFix(number, fractionDigits = 1) {
  return parseFloat(number).toFixed(fractionDigits)
}

export function getAirportPoint(routes) {
  let airport = []
  for (let i = 0; i < routes.length; i++) {
    if (i < routes.length - 1 && routes[i].transport.name_en === transports.AIRWAY) {
      airport.push([routes[i], routes[++i]])
    }
  }
  return airport
}

export function getCode(id) {
  if (id < 10) {
    return '0000' + id;
  } else if (id < 100) {
    return '000' + id
  } else if (id < 1000) {
    return '00' + id
  } else if (id < 10000) {
    return '0' + id
  }
  return id
}

export function shrinkCode(string) {
  return string.replace(/^0+/, '')
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.substr(1)
}

export function calcTotalPage(total, per_page) {
  return total % per_page === 0 ? parseInt(total / per_page) : parseInt(total / per_page) + 1
}

export function slugify(str) {
  if (!str || str == '') {
    return 'unknown'
  }
  str = str
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '')
  if (!str || str == '') {
    return 'u';
  }
  return str;
}

function _getCategory(data) {
	if (!data) {
		return
	}
	let item = data.find((item) => {
		return mainCategoriesList.indexOf(item.id) === -1
	})

	return item ? item : data[0]
}

function _getMainCategory(data) {
	if (!data) {
		return
	}
	let item = data.find((item) => {
		return mainCategoriesList.indexOf(item.id) > -1
	})

	return item ? item : data[0]
}

export function convertWptoPost(data) {
  return data.map((item) => {
    return _.merge(_.pick(item, ['id', 'date', 'slug']), {
      title: _.result(item, 'title.rendered'),
      excerpt: _.result(item, 'excerpt.rendered'),
      author: _.pick(_.result(item, '_embedded.author[0]'), ['id', 'name']), //_embedded.author[0].avatar_urls[96]
      category: _getCategory(_.result(item, '_embedded.wp:term[0]')),
      mainCategory: _getMainCategory(_.result(item, '_embedded.wp:term[0]')),
      thumnail: _.result(
        item,
        "_embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url"
      ),
      photo: _.result(
        item,
        "_embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url"
      ),
      metadesc: _.result(item, 'yoast_meta.yoast_wpseo_metadesc') ? _.result(item, 'yoast_meta.yoast_wpseo_metadesc') : _.result(item, 'title.rendered'),
      metatitle: _.result(item, 'yoast_meta.yoast_wpseo_title') ? _.result(item, 'yoast_meta.yoast_wpseo_title') : _.result(item, 'title.rendered')
    })
  })
}
export function convertWptoPostDetail(data) {
  return _.merge(_.pick(data, ['id', 'date', 'slug']), {
    title: _.result(data, 'title.rendered'),
    excerpt: _.result(data, 'excerpt.rendered'),
    author: _.pick(_.result(data, '_embedded.author[0]'), ['id', 'name', 'description']), //_embedded.author[0].avatar_urls[96],
    author_Avatar: _.result(data, "_embedded['author'][0].avatar_urls.96"),
    category: _getCategory(_.result(data, '_embedded.wp:term[0]')),
    mainCategory: _getMainCategory(_.result(data, '_embedded.wp:term[0]')),
    thumnail: _.result(
      data,
      "_embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url"
    ),
    content: _.result(data, 'content.rendered'),
    photo: _.result(
      data,
      "_embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url"
    ),
    metadesc: _.result(data, 'yoast_meta.yoast_wpseo_metadesc') ? _.result(data, 'yoast_meta.yoast_wpseo_metadesc') : _.result(data, 'title.rendered'),
    metatitle: _.result(data, 'yoast_meta.yoast_wpseo_title') ? _.result(data, 'yoast_meta.yoast_wpseo_title') : _.result(data, 'title.rendered')
  })
}

export function convertWpTags(data) {
  return data.map((item) => {
    return _.pick(item, ['id', 'name', 'slug'])
  })
}

export function convertWpTag(data){
  return _.pick(data, ['id', 'name', 'slug'])
}

export function replaceInvalidCharacter(string){
  let temp = string.replace('đ', '%C4%91')
  return temp
}

export function groupDayRoute(arr){
  let res = []
  let tempArr = []
  for(let i = 0; i < arr.length; i++){
    if(!tempArr.length || arr[i].day === tempArr[tempArr.length - 1].day){
      tempArr.push(arr[i])
    }
    if(arr[i].day !== tempArr[tempArr.length - 1].day){
     res.push({
       day: tempArr[tempArr.length - 1].day,
       routes: tempArr
     })
     tempArr = []
     tempArr.push(arr[i])
   }
  }
  if(tempArr.length){
    res.push({
      day: tempArr[tempArr.length - 1].day,
      routes: tempArr
    })
  }
  return res
}

export function convertCurrencyToUSD(money, rate){
  return _.round(money / rate, 2)
}


export function caculateRefund(money, startDay, isHoliday){
  let numDay = distanceFromDays(new Date(), new Date(startDay))
  return money * percentMoneyRefund(numDay, isHoliday) / 100
}

function percentMoneyRefund(numDay, holiday) {
    if (!holiday) {
        if (numDay >= 20) {
            return 100;
        } else if (15 <= numDay && numDay <= 19) {
            return 85;
        } else if (12 <= numDay && numDay <= 14) {
            return 70;
        } else if (8 <= numDay && numDay <= 11) {
            return 50;
        } else if (5 <= numDay && numDay <= 7) {
            return 30;
        } else if (2 <= numDay && numDay <= 4) {
            return 10;
        } else {
            return 0;
        }
    } else {
        if (numDay >= 30) {
            return 100;
        } else if (25 <= numDay && numDay <= 29) {
            return 85;
        } else if (22 <= numDay && numDay <= 24) {
            return 70;
        } else if (17 <= numDay && numDay <= 19) {
            return 50;
        } else if (8 <= numDay && numDay <= 16) {
            return 30;
        } else if (2 <= numDay && numDay <= 7) {
            return 10;
        } else {
            return 0;
        }
    }
}
