import React from 'react'
import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { initStore } from '../store'
import { authLogin } from '../actions'
import Routes from 'routes'

class TouristApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let user = null
        if (ctx.req && ctx.req.cookies && ctx.req.cookies.user) {
            user = JSON.parse(ctx.req.cookies.user)
            ctx.res.clearCookie('user')
            await ctx.store.dispatch(authLogin(user))
        }

        let pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
        pageProps = pageProps || {}
        pageProps.route = Routes.match(ctx.asPath)
        pageProps.route = Routes.match(ctx.asPath)

        return { pageProps, user }
    }

    render() {
        const { Component, pageProps, store } = this.props
        return (
            <Container>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        )
    }
}

export default withRedux(initStore)(TouristApp)
