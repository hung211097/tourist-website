import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'components'
import styles from '../styles/error.scss'
import { Link } from 'routes'
import { withNamespaces } from "react-i18next"

class Error extends React.Component {
    displayName = 'Error Page'

    static getInitialProps ({ res, err }) {
        const statusCode = res ? res.statusCode : (err ? err.statusCode : null)
        return { statusCode }
    }

    static propTypes = {
        statusCode: PropTypes.number,
        t: PropTypes.func
    }

    render () {
      const {t} = this.props
        return(
            <>
                <Layout page = "error" {...this.props}>
                  <style jsx="jsx">{styles}</style>
                    <section className="middle">
                      <div className="container">
                        <div className="box-404">
                          <div id="notfound">
                            <div className="notfound">
                              <div className="notfound-404">
                                <h1>:(</h1>
                              </div>
                              <h2>404 - {t('404.not_found')}</h2>
                              <p>{t('404.content')}</p>
                              <Link route="home">
                                <a>{t('404.homepage')}</a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                </Layout>
            </>
        )
    }
}

export default  withNamespaces('translation')(Error)
