import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'

class SearchResult extends React.Component {
  displayName = 'Search Result'

  constructor(props) {
    super(props)
    this.state = {
      keyword: ''
    }
  }

  componentDidMount() {

  }

  handleSubmit(){

  }

  handleChangeKeyword(e){
    this.setState({
      keyword: e.target.value
    })
  }

  render() {
    return (
      <>
        <Layout page="search" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>SEARCH</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>
            <div className="sort-zone row">
              <div className="col-sm-12 no-padding">
                <div className="inner">
                  <div className="wrapper">
                    <div className="sort-option-zone">
                      <div className="sort-option-container">
                        <ul>
                          <li className="sort-option">
                            <p>Price</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li><a>Lowest Price</a></li>
                              <li><a>Highest Price</a></li>
                            </ul>
                          </li>
                          <li className="sort-option">
                            <p>Name</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li><a>Desc</a></li>
                              <li><a>Asc</a></li>
                            </ul>
                          </li>
                          <li className="sort-option">
                            <p>Rating</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li><a>Desc</a></li>
                              <li><a>Asc</a></li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <div className="row content-page">
                <div className="col-sm-12 no-padding">
                  <div className="inner">
                    <div className="row wrapper">
                      <div className="col-sm-4 form-filter">
                        <form onSubmit={this.handleSubmit.bind(this)}>
                          <div className="search-name-box">
                            <div className="title">
                              <h3>Search your destination :</h3>
                            </div>
                            <div className="input-name-container">
                              <input type="text" name="name-tour" value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}/>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="col-sm-8">

                      </div>
                    </div>
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

export default SearchResult
