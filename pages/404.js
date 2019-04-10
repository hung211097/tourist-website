import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'components'
import styles from '../styles/error.scss'
import { Link } from 'routes'

export default class Error extends React.Component {
    displayName = 'Error Page'

    static getInitialProps ({ res, err }) {
        const statusCode = res ? res.statusCode : (err ? err.statusCode : null)
        return { statusCode }
    }

    static propTypes = {
        statusCode: PropTypes.number
    }

    render () {
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
                              <h2>404 - Page not found</h2>
                              <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                              <Link route="home">
                                <a>home page</a>
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
