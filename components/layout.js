import React from 'react'
import Head from 'next/head'
import { Header, Footer } from 'components'
import indexStyles from 'styles/global.scss'
import PropTypes from 'prop-types'
import { convertFullUrl } from 'services/utils.service'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class extends React.Component {
    displayName = 'Layout Component'

    static propTypes = {
        page: PropTypes.string,
        children: PropTypes.any.isRequired,
        route: PropTypes.any,
        seo: PropTypes.object
    }

    static defaultProps = {
        seo: {
            title: 'Travel Tour'
        }
    }

    componentDidMount(){
      document.scrollTop = 0
    }

    constructor(props) {
        super(props)
    }

    render() {
        let { route, seo } = this.props
        const style = indexStyles
        const full_url = convertFullUrl(route.parsedUrl.pathname)
        let fullTitle = `${this.props.seo.title || 'Travel Tour'}`
        let description = seo.description || 'Travel Tour - Trang du lịch hàng đầu Việt Nam'
        let trimmedDescription = description.length > 150 ? description.substring(0, 147 - 3) + '...' : description
        return (
            <>
                <Head>
                    <meta charSet="utf-8" />
                    {/*<meta name="google-site-verification" content="dX6hIg3bpEcYOcbHx4f3Nrbc6g65d9Wcgz_Fl4-Q6mU" />*/}
                    <meta httpEquiv="Content-type" content="text/html;charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="robots" content="index, follow" />
                    <meta name="revisit-after" content="1 days" />
                    <meta name="description" content={trimmedDescription} />
                    <meta property="og:locale" content="vi_VN" />
                    <meta property="og:type" content="website" />
                    {/*<meta property="og:site_name" content="community.pretty.tips" />*/}
                    <meta property="og:description" content={trimmedDescription} />
                    <meta property="og:title" content={fullTitle} />
                    <meta property="og:url" content={full_url} />
                    <meta property="description" content={trimmedDescription} />

                    <meta property="twitter:description" content={trimmedDescription} />
                    <meta property="twitter:title" content={fullTitle} />
                    <meta property="twitter:url" content={full_url} />
                    {this.props.seo.image && (
                        <>
                            <meta property="og:image" content={seo.image} />
                            <meta property="twitter:image" content={seo.image} />
                        </>
                    )}

                    <link rel="canonical" href={full_url} />
                    <link
                        rel="shortcut icon"
                        href="/static/favicon/favicon.ico"
                        type="image/x-icon"
                        sizes="64x64"
                    />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />
                    <title>{fullTitle}</title>
                    <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
                </Head>
                <style jsx global>
                    {style}
                </style>
                {/*<Modal />*/}
                <Header page={this.props.page}/>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={false}
                    transitionLeave={false}>
                    {this.props.children}
                </ReactCSSTransitionGroup>
                <Footer/>
            </>
        )
    }
}
