const routes = require('next-routes')

                                                    // Name                   Page                    Pattern
module.exports = routes()                           // ----                   ----                    -----
.add('home', '/', 'index')                          // home                   index                   /
.add('login', '/login')                             // login                  login                   /login
.add('register', '/register')                       // register               register                /register
.add('profile', '/profile')                         // profile                profile                 /profile
.add('my-booking', '/profile/my-booking')           //my-booking              my-booking              /profile/my-booking
.add('detail-booked-tour', '/profile/my-booking/:id(\\d+)') //detail-booked-tour    detail-booked-tour              /profile/my-booking/:id
.add('update-profile', '/profile/update')           // update-profile         update-profile          /profile/update
.add('change-password', '/profile/change-password') // change-password        change-password         /profile/change-password
.add('forget-password', '/forget-password')         // forget-password        forget-password         /forget-password
.add('about-us')                                    // about-us               about-us                /about-us
.add('terms-condition')                             // terms-condition        terms-condition         /terms-condition
.add('faq')                                         // faq                    faq                     /faq
.add('contact')                                     // contact                contact                 /contact
.add('tours', '/tour/:name-:id(\\d+)')                    // tours                  tours                   /tours/:name-:id
.add('detail-tour', '/tour/:id(\\d+)/:name')       // detail-tour            detail-tour            /tours/:id/:name
.add('search-result', '/search')                    // search-result          search                 /search-result?keyword=
.add('checkout-passengers', '/checkout/passengers') // checkout               checkout-passengers     /checkout/passengers
.add('checkout-payment', '/checkout/payment')       // checkout-payment       checkout-payment        /checkout/payment
.add('checkout-confirmation', '/checkout/confirmation')// checkout-confirmation    checkout-confirmation        /checkout/confirmation
.add('news')                                        //news                    news                    /news
.add('detail-news', '/news/:slug-:id(\\d+)')              //detail-news             detail-news             /news/:slug-:id
.add('404')
// .add('user', '/user/:id', 'profile')                // user   profile   /user/:id
// .add('/:noname/:lang(en|es)/:wow+', 'complex')      // (none) complex   /:noname/:lang(en|es)/:wow+
// .add({name: 'beta', pattern: '/v3', page: 'v3'})    // beta   v3        /v3
