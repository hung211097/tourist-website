import React from 'react'
import styles from './index.scss'
import { Layout, RatingStar, SearchItem } from 'components'
import Slider from 'react-rangeslider'
import { FaFilter, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaList } from "react-icons/fa"
import { TiThSmallOutline } from "react-icons/ti"
import { UnmountClosed } from 'react-collapse'
import ReactPaginate from 'react-paginate'

class SearchResult extends React.Component {
  displayName = 'Search Result'

  constructor(props) {
    super(props)
    this.state = {
      keyword: '',
      date: '',
      sortBy: '',
      sortType: '',
      price: 0,
      rate: 0,
      lasting: 0,
      filterShow: true,
      isListView: true
    }
  }

  componentDidMount() {

  }

  handleSubmit(e){
    e.preventDefault()
  }

  handleChangeKeyword(e){
    this.setState({
      keyword: e.target.value
    })
  }

  handleChangeDate(e){
    this.setState({
      date: e.target.value
    })
  }

  handleChangePrice(value){
    this.setState({
      price: value
    })
  }

  handleChangeLasting(value){
    this.setState({
      lasting: value
    })
  }

  handleChangeRate(e) {
      this.setState({
          rate: e.target.value
      })
  }

  handleToggleFilter(){
    this.setState({
      filterShow: !this.state.filterShow
    })
  }

  handleReset(){
    this.setState({
      keyword: '',
      date: '',
      price: 0,
      rate: 0,
      lasting: 0,
      sortBy: '',
      sortType: ''
    })
  }

  handlePageClick(value){
    // console.log(value);
  }

  offListView(){
    this.setState({
      isListView: false
    })
  }

  onListView(){
    this.setState({
      isListView: true
    })
  }

  handleChangeSort(by, type){
    this.setState({
      sortBy: by,
      sortType: type
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
            <div className="sort-zone row no-margin">
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
                              <li className={this.state.sortBy === "price" && this.state.sortType === "ASC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "price", "ASC")}>
                                <a>Lowest Price</a>
                              </li>
                              <li className={this.state.sortBy === "price" && this.state.sortType === "DESC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "price", "DESC")}>
                                <a>Highest Price</a>
                              </li>
                            </ul>
                          </li>
                          <li className="sort-option">
                            <p>Date</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li className={this.state.sortBy === "date" && this.state.sortType === "ASC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "date", "ASC")}>
                                <a>Asc</a>
                              </li>
                              <li className={this.state.sortBy === "date" && this.state.sortType === "DESC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "date", "DESC")}>
                                <a>Desc</a>
                              </li>
                            </ul>
                          </li>
                          <li className="sort-option">
                            <p>Rating</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li className={this.state.sortBy === "rating" && this.state.sortType === "ASC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "rating", "ASC")}>
                                <a>Asc</a>
                              </li>
                              <li className={this.state.sortBy === "rating" && this.state.sortType === "DESC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "rating", "DESC")}>
                                <a>Desc</a>
                              </li>
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
                <div className="col-sm-12">
                  <div className="inner">
                    <div className="row wrapper">
                      <div className="col-sm-4 form-filter">
                        <div className="d-sm-none d-block">         {/*Filter for responsive*/}
                          <div className="filter-zone">
                            <div className="title-filter" onClick={this.handleToggleFilter.bind(this)}>
                              <h3>
                                FILTER <FaFilter />
                                <span className="pull-right">
                                  {this.state.filterShow ?
                                    <FaChevronDown />
                                    : <FaChevronUp />
                                  }
                                </span>
                              </h3>
                            </div>
                            <UnmountClosed isOpened={this.state.filterShow} springConfig={{stiffness: 150, damping: 20}}>
                              <div className="collapse-content">
                                <form onSubmit={this.handleSubmit.bind(this)}>
                                  <div className="search-name-box">
                                    <div className="title">
                                      <h3>Search your destination:</h3>
                                    </div>
                                    <div className="input-name-container">
                                      <input type="text" name="name-tour" value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}/>
                                    </div>
                                  </div>
                                  <div className="search-date-box">
                                    <div className="search-date-container">
                                      <div className="nd_options_height_10" />
                                      <h3>Select your date:</h3>
                                      <div className="nd_options_height_20" />
                                      <div className="search-date-wrapper">
                                        <input type="date" value={this.state.date} onChange={this.handleChangeDate.bind(this)}/>
                                      </div>
                                    </div>
                                    <div className="nd_options_height_5" />
                                    <div className="break" />
                                  </div>
                                  <div className="price-range-box">
                                    <div className="price-range-container">
                                      <div className="nd_travel_section">
                                        <h3>Max Price:</h3>
                                        <p><span>{this.state.price.toLocaleString()}</span> VND</p>
                                      </div>
                                      <div className="nd_travel_section mt-50">
                                        <Slider
                                          min={0}
                                          max={100000000}
                                          step={10000}
                                          tooltip={false}
                                          value={this.state.price}
                                          orientation="horizontal"
                                          onChange={this.handleChangePrice.bind(this)}
                                        />
                                      </div>
                                    </div>
                                    <div className="nd_options_height_10" />
                                    <div className="break" />
                                  </div>
                                  <div className="lasting-range-box">
                                    <div className="lasting-range-container">
                                      <div className="nd_travel_section">
                                        <h3>Lasting in:</h3>
                                        <p><span>{this.state.lasting}</span> day</p>
                                      </div>
                                      <div className="nd_travel_section mt-50">
                                        <Slider
                                          min={0}
                                          max={30}
                                          step={1}
                                          tooltip={false}
                                          value={this.state.lasting}
                                          orientation="horizontal"
                                          onChange={this.handleChangeLasting.bind(this)}
                                        />
                                      </div>
                                    </div>
                                    <div className="nd_options_height_10" />
                                    <div className="break" />
                                  </div>
                                  <div className="rating-box">
                                    <div className="acc-content">
                                      <div className="nd_travel_section">
                                        <h3>Rating:</h3>
                                      </div>
                                      <div className="nd_options_height_10" />
                                      <div className="acc-rating">
                                        <div className="co-radio-rate">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={5}
                                                    checked={this.state.rate == 5}
                                                    onChange={this.handleChangeRate.bind(this)}
                                                    name="check-rate-mobile"
                                                />
                                                <div className="co-rate">
                                                    <RatingStar rate={5} />
                                                </div>
                                            </label>
                                        </div>
                                        <div className="co-radio-rate">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={4}
                                                    checked={this.state.rate == 4}
                                                    onChange={this.handleChangeRate.bind(this)}
                                                    name="check-rate-mobile"
                                                />
                                                <div className="co-rate">
                                                    <RatingStar rate={4} />
                                                </div>
                                            </label>
                                        </div>
                                        <div className="co-radio-rate">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={3}
                                                    checked={this.state.rate == 3}
                                                    onChange={this.handleChangeRate.bind(this)}
                                                    name="check-rate-mobile"
                                                />
                                                <div className="co-rate">
                                                    <RatingStar rate={3} />
                                                </div>
                                            </label>
                                        </div>
                                        <div className="co-radio-rate">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={2}
                                                    checked={this.state.rate == 2}
                                                    onChange={this.handleChangeRate.bind(this)}
                                                    name="check-rate-mobile"
                                                />
                                                <div className="co-rate">
                                                    <RatingStar rate={2} />
                                                </div>
                                            </label>
                                        </div>
                                        <div className="co-radio-rate">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={1}
                                                    checked={this.state.rate == 1}
                                                    onChange={this.handleChangeRate.bind(this)}
                                                    name="check-rate-mobile"
                                                />
                                                <div className="co-rate">
                                                    <RatingStar rate={1} />
                                                </div>
                                            </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="confirm-zone">
                                    <div className="text-center">
                                      <button type="submit" className="co-btn green" onClick={this.handleSubmit.bind(this)}>SEARCH</button>
                                      <button type="button" className="co-btn green" onClick={this.handleReset.bind(this)}>RESET</button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </UnmountClosed>
                          </div>
                        </div>
                        <form onSubmit={this.handleSubmit.bind(this)} className="d-sm-block d-none">
                          <div className="search-name-box">
                            <div className="title">
                              <h3>Search your destination:</h3>
                            </div>
                            <div className="input-name-container">
                              <input type="text" name="name-tour" value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}/>
                            </div>
                          </div>
                          <div className="search-date-box">
                            <div className="search-date-container">
                              <div className="nd_options_height_10" />
                              <h3>Select your date:</h3>
                              <div className="nd_options_height_20" />
                              <div className="search-date-wrapper">
                                <input type="date" value={this.state.date} onChange={this.handleChangeDate.bind(this)}/>
                              </div>
                            </div>
                            <div className="nd_options_height_5" />
                            <div className="break" />
                          </div>
                          <div className="price-range-box">
                            <div className="price-range-container">
                              <div className="nd_travel_section">
                                <h3>Max Price:</h3>
                                <p><span>{this.state.price.toLocaleString()}</span> VND</p>
                              </div>
                              <div className="nd_travel_section mt-50">
                                <Slider
                                  min={0}
                                  max={100000000}
                                  step={10000}
                                  tooltip={false}
                                  value={this.state.price}
                                  orientation="horizontal"
                                  onChange={this.handleChangePrice.bind(this)}
                                />
                              </div>
                            </div>
                            <div className="nd_options_height_10" />
                            <div className="break" />
                          </div>
                          <div className="lasting-range-box">
                            <div className="lasting-range-container">
                              <div className="nd_travel_section">
                                <h3>Lasting in:</h3>
                                <p><span>{this.state.lasting}</span> day</p>
                              </div>
                              <div className="nd_travel_section mt-50">
                                <Slider
                                  min={0}
                                  max={30}
                                  step={1}
                                  tooltip={false}
                                  value={this.state.lasting}
                                  orientation="horizontal"
                                  onChange={this.handleChangeLasting.bind(this)}
                                />
                              </div>
                            </div>
                            <div className="nd_options_height_10" />
                            <div className="break" />
                          </div>
                          <div className="rating-box">
                            <div className="acc-content">
                              <div className="nd_travel_section">
                                <h3>Rating:</h3>
                              </div>
                              <div className="nd_options_height_10" />
                              <div className="acc-rating">
                                <div className="co-radio-rate">
                                    <label>
                                        <input
                                            type="radio"
                                            value={5}
                                            checked={this.state.rate == 5}
                                            onChange={this.handleChangeRate.bind(this)}
                                            name="check-rate-mobile"
                                        />
                                        <div className="co-rate">
                                            <RatingStar rate={5} />
                                        </div>
                                    </label>
                                </div>
                                <div className="co-radio-rate">
                                    <label>
                                        <input
                                            type="radio"
                                            value={4}
                                            checked={this.state.rate == 4}
                                            onChange={this.handleChangeRate.bind(this)}
                                            name="check-rate-mobile"
                                        />
                                        <div className="co-rate">
                                            <RatingStar rate={4} />
                                        </div>
                                    </label>
                                </div>
                                <div className="co-radio-rate">
                                    <label>
                                        <input
                                            type="radio"
                                            value={3}
                                            checked={this.state.rate == 3}
                                            onChange={this.handleChangeRate.bind(this)}
                                            name="check-rate-mobile"
                                        />
                                        <div className="co-rate">
                                            <RatingStar rate={3} />
                                        </div>
                                    </label>
                                </div>
                                <div className="co-radio-rate">
                                    <label>
                                        <input
                                            type="radio"
                                            value={2}
                                            checked={this.state.rate == 2}
                                            onChange={this.handleChangeRate.bind(this)}
                                            name="check-rate-mobile"
                                        />
                                        <div className="co-rate">
                                            <RatingStar rate={2} />
                                        </div>
                                    </label>
                                </div>
                                <div className="co-radio-rate">
                                    <label>
                                        <input
                                            type="radio"
                                            value={1}
                                            checked={this.state.rate == 1}
                                            onChange={this.handleChangeRate.bind(this)}
                                            name="check-rate-mobile"
                                        />
                                        <div className="co-rate">
                                            <RatingStar rate={1} />
                                        </div>
                                    </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="confirm-zone">
                            <div className="text-center">
                              <button type="submit" className="co-btn green" onClick={this.handleSubmit.bind(this)}>SEARCH</button>
                              <button type="button" className="co-btn green" onClick={this.handleReset.bind(this)}>RESET</button>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="col-sm-8 search-zone">
                          <div className="break d-sm-none d-block mb-5" />
                        <div className="search-for">
                          <div className="title d-inline-block">
                            <h2>Search&apos;s result for: &quot;ABC&quot;</h2>
                          </div>
                          <div className="change-view">
                            <span className={this.state.isListView ? "active" : ''}>
                              <a onClick={this.onListView.bind(this)}><FaList /></a>
                            </span>
                            <span className={!this.state.isListView ? "active" : ''}>
                              <a onClick={this.offListView.bind(this)}><TiThSmallOutline /></a>
                            </span>
                          </div>
                        </div>
                        <div className="search-content">
                          <div className="no-result">
                            <img alt="warning" src="/static/svg/icon-warning-white.svg" width="20" />
                            <h3>No results for this search</h3>
                          </div>
                          <div className="search-list-item row no-margin">
                            {[1,2,3,4,5].map((item, key) => {
                                return(
                                  <SearchItem key={key} isGrid={!this.state.isListView}/>
                                )
                              })
                            }
                          </div>
                        </div>
                        <div className="pagination row text-center">
                          <ReactPaginate
                            previousLabel={<FaChevronLeft />}
                            nextLabel={<FaChevronRight />}
                            previousClassName={'previous-pagination-li'}
                            nextClassName={'next-pagination-li'}
                            previousLinkClassName={'previous-pagination-a'}
                            nextLinkClassName={'next-pagination-a'}
                            disabledClassName={'disabled-navigate'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={10}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={1}
                            onPageChange={this.handlePageClick.bind(this)}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            pageClassName={'custom-pagination-li'}
                            pageLinkClassName={'custom-pagination-a'}/>
                        </div>
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
