import routes, { Router } from 'routes'
import { convertFullUrl } from 'services/utils.service'

export default function Redirect(res, name, params = {}, code = 302) {
  let router = routes.findAndGetUrls(name, params)
  if (res) {
      res.writeHead(302, {
        Location: `${router.urls.as}`
      })
      res.end()
    } else {
      Router.pushRoute(router.urls.as, params)
    }
}

export function GetLink(name, params = {}){
  return convertFullUrl(routes.findAndGetUrls(name, params).urls.as)
}
