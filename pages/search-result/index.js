import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, SearchItem, RatingStar } from 'components' //Bỏ RatingStar
import Slider from 'react-rangeslider'
import { UnmountClosed } from 'react-collapse'
import ReactPaginate from 'react-paginate'
import ApiService from 'services/api.service'
import { calcTotalPage, replaceInvalidCharacter } from '../../services/utils.service'
import Autosuggest from 'react-autosuggest'
import { Router } from 'routes'
import { withNamespaces } from "react-i18next"
import { metaData } from '../../constants/meta-data'
import Select from 'react-select'

class SearchResult extends React.Component {
  displayName = 'Search Result'

  static propTypes = {
    query: PropTypes.object,
    t: PropTypes.func,
    route: PropTypes.object
  }

  static async getInitialProps({ query }) {
    return { query }
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      keyword: '',
      keywordDisplay: props.query.keyword,
      date: '',
      sortBy: '',
      sortType: '',
      price: 0,
      rate: 0,
      lasting: 0,
      filterShow: true, //Show phần filter ở mobile hay không?
      isListView: true, //Xem dạng list ngang hay grid ô
      searchResult: null,
      totalPage: 0,
      page: 0,
      isSubmit: false,
      autoSuggest: [],
      sort: ''
    }
    this.sorts = [
      { value: 'priceAsc', label: props.t('search.priceAsc') },
      { value: 'priceDesc', label: props.t('search.priceDesc')  },
      { value: 'dateAsc', label: props.t('search.dateAsc')  },
      { value: 'dateDesc', label: props.t('search.dateDesc')  },
      { value: 'ratingAsc', label: props.t('search.ratingAsc')  },
      { value: 'ratingDesc', label: props.t('search.ratingDesc')  },
    ]
    this.mapSort = {
      'priceAsc': {
        sortBy: 'price',
        sortType: 'ASC'
      },
      'priceDesc': {
        sortBy: 'price',
        sortType: 'DESC'
      },
      'dateAsc': {
        sortBy: 'date',
        sortType: 'ASC'
      },
      'dateDesc': {
        sortBy: 'date',
        sortType: 'DESC'
      },
      'ratingAsc': {
        sortBy: 'rating',
        sortType: 'ASC'
      },
      'ratingDesc': {
        sortBy: 'rating',
        sortType: 'DESC'
      },
    }
  }

  componentDidMount() {
    this.init(this.props)
  }

  init(props){
    const {query} = props
    this.apiService.search(1, 5, query.keyword ? {name: replaceInvalidCharacter(query.keyword)} : {}).then((res) => {
      this.setState({
        searchResult: res.data,
        totalPage: res.data ? calcTotalPage(res.itemCount, 5) : 0,
        keywordDisplay: query.keyword
      })
    })
  }

  componentWillUnmount(){
    this.timeout && clearTimeout(this.timeout)
  }

  UNSAFE_componentWillReceiveProps(props){
    this.init(props)
    this.handleReset()
    this.sorts.forEach((item) => {
      item.label = props.t(`search.${item.value}`)
    })
  }

  loadSearchItem(){
    let params = {}
    if(this.props.query.keyword){
      params.name = this.props.query.keyword
    }
    if(this.state.price){
      params.price = this.state.price
    }
    if(this.state.date){
      params.date = this.state.date
    }
    if(this.state.rate){
      params.rating = this.state.rate
    }
    if(this.state.lasting){
      params.lasting = this.state.lasting
    }
    if(this.state.sortBy){
      params.sortBy = this.state.sortBy
    }
    if(this.state.sortType){
      params.sortType = this.state.sortType
    }
    this.apiService.search(this.state.page + 1, this.state.isListView ? 5 : 6, params).then((res) => {
      this.setState({
        searchResult: res.data,
        totalPage: calcTotalPage(res.itemCount, this.state.isListView ? 5 : 6),
      })
    })
  }

  handleSubmitFilter(e){
    e.preventDefault()
    this.setState({
      page: 0
    }, () => {
      this.loadSearchItem()
    })
  }

  handleSubmitSearch(e){
    e.preventDefault()
    if(!this.state.keyword){
      return
    }
    Router.pushRoute('search-result', { keyword: this.state.keyword })
    this.setState({
      keyword: ''
    })
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
      sortType: '',
      flag: false
    })
  }

  handlePageClick(value){
    this.setState({
      page: value.selected
    }, () => {
      this.loadSearchItem()
    })
  }

  offListView(){
    this.setState({
      isListView: false,
      page: 0
    }, () => {
      this.loadSearchItem()
    })
  }

  onListView(){
    this.setState({
      isListView: true,
      page: 0
    }, () => {
      this.loadSearchItem()
    })
  }

  handleChangeSort(event){
    this.setState({
      sort: event.value,
      sortBy: this.mapSort[event.value].sortBy,
      sortType: this.mapSort[event.value].sortType,
      page: 0
    }, () => {
      this.loadSearchItem()
    })
  }

  getSuggestionValue = (suggest) => {
    return suggest.name
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.timeout && clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.apiService.getAutoSuggestTour(value).then((res) => {
        this.setState({
          autoSuggest: res.data
        })
      })
    }, 500)
  };

  onSuggestionsClearRequested = () => {
    if(this.state.autoSuggest.length){
      this.setState({
        autoSuggest: []
      });
    }
  };

  onSuggestionSelected = (e, {suggestionValue}) => {
    this.setState({
      keyword: suggestionValue
    })
  }

  render() {
    const {t} = this.props
    return (
      <>
        <Layout page="search"
          seo={{
              title: metaData.SEARCH_RESULT.title.replace('[KEYWORD]', this.props.route.query.keyword),
              description: metaData.SEARCH_RESULT.description
          }} {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            {/*<div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('search.title')}</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>*/}
            {/*<div className="sort-zone row no-margin">
              <div className="col-sm-12 no-padding">
                <div className="inner no-padding">
                  <div className="wrapper">
                    <div className="sort-option-zone">
                      <div className="sort-option-container">
                        <ul>
                          <li className="sort-option">
                            <p>{t('search.sort_price')}</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li className={this.state.sortBy === "price" && this.state.sortType === "ASC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "price", "ASC")}>
                                <a>{t('search.lowest_price')}</a>
                              </li>
                              <li className={this.state.sortBy === "price" && this.state.sortType === "DESC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "price", "DESC")}>
                                <a>{t('search.highest_price')}</a>
                              </li>
                            </ul>
                          </li>
                          <li className="sort-option">
                            <p>{t('search.sort_date')}</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li className={this.state.sortBy === "date" && this.state.sortType === "ASC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "date", "ASC")}>
                                <a>{t('search.asc')}</a>
                              </li>
                              <li className={this.state.sortBy === "date" && this.state.sortType === "DESC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "date", "DESC")}>
                                <a>{t('search.desc')}</a>
                              </li>
                            </ul>
                          </li>
                          <li className="sort-option">
                            <p>{t('search.sort_rating')}</p>
                            <img alt="down-arrow" src="/static/svg/icon-down-arrow-white.svg" width={13} />
                            <ul>
                              <li className={this.state.sortBy === "rating" && this.state.sortType === "ASC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "rating", "ASC")}>
                                <a>{t('search.asc')}</a>
                              </li>
                              <li className={this.state.sortBy === "rating" && this.state.sortType === "DESC" ? "active" : ''}
                                onClick={this.handleChangeSort.bind(this, "rating", "DESC")}>
                                <a>{t('search.desc')}</a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>*/}
            <div className="nd_options_container nd_options_clearfix content" style={{marginTop: '0'}}>
              <div className="row content-page">
                <div className="col-sm-12">
                  <div className="inner">
                    <div className="row wrapper">
                      <div className="col-sm-4 form-filter">
                        <div className="d-sm-none d-block">         {/*Filter for responsive*/}
                          <div className="filter-zone">
                            <form onSubmit={this.handleSubmitSearch.bind(this)}>
                              <div className="search-name-box">
                                <div className="title">
                                  <h3>{t('search.search_destination')}:</h3>
                                </div>
                                <div className="input-name-container">
                                  {/*<input type="text" name="name-tour" value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}/>*/}
                                    <Autosuggest
                                      suggestions={this.state.autoSuggest}
                                      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                      onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                      getSuggestionValue={this.getSuggestionValue}
                                      onSuggestionSelected={this.onSuggestionSelected}
                                      renderSuggestion={(suggestion) =>
                                        (<div>
                                          {suggestion.name}
                                        </div>)}
                                      inputProps={{
                                        value: this.state.keyword,
                                        onChange: this.handleChangeKeyword.bind(this),
                                        className: "react-autosuggest-search"
                                      }}
                                    />
                                </div>
                              </div>
                            </form>
                            <div className="title-filter" onClick={this.handleToggleFilter.bind(this)}>
                              <h3>
                                {t('search.filter')} <i className="fas fa-filter"></i>
                                <span className="pull-right">
                                  {this.state.filterShow ?
                                    <i className="fas fa-chevron-down"></i>
                                    : <i className="fas fa-chevron-up"></i>
                                  }
                                </span>
                              </h3>
                            </div>
                            <UnmountClosed isOpened={this.state.filterShow} springConfig={{stiffness: 150, damping: 20}}>
                              <div className="collapse-content">
                                <form onSubmit={this.handleSubmitFilter.bind(this)}>
                                  <div className="search-date-box">
                                    <div className="search-date-container">
                                      <div className="nd_options_height_10" />
                                      <h3>{t('search.select_date')}:</h3>
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
                                        <h3>{t('search.max_price')}:</h3>
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
                                        <h3>{t('search.last_in')}:</h3>
                                        <p><span>{this.state.lasting}</span> {t('search.days')}</p>
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
                                        <h3>{t('search.rating')}:</h3>
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
                                      <button type="submit" className="co-btn green" onClick={this.handleSubmitFilter.bind(this)}>{t('search.apply')}</button>
                                      <button type="button" className="co-btn green" onClick={this.handleReset.bind(this)}>{t('search.reset')}</button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </UnmountClosed>
                          </div>
                        </div>
                        <form onSubmit={this.handleSubmitSearch.bind(this)} className="d-sm-block d-none">
                          <div className="search-name-box">
                            <div className="title">
                              <h3>{t('search.search_destination')}:</h3>
                            </div>
                            <div className="input-name-container">
                              {/*<input type="text" name="name-tour" value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}/>*/}
                                <Autosuggest
                                  suggestions={this.state.autoSuggest}
                                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                  getSuggestionValue={this.getSuggestionValue}
                                  onSuggestionSelected={this.onSuggestionSelected}
                                  renderSuggestion={(suggestion) =>
                                    (<div>
                                      {suggestion.name}
                                    </div>)}
                                  inputProps={{
                                    value: this.state.keyword,
                                    onChange: this.handleChangeKeyword.bind(this),
                                    className: "react-autosuggest-search"
                                  }}
                                />
                            </div>
                          </div>
                        </form>
                        <form onSubmit={this.handleSubmitFilter.bind(this)} className="d-sm-block d-none">
                          <div className="title-filter-web">
                            <h3>
                              {t('search.filter')} <i className="fas fa-filter"></i>
                            </h3>
                          </div>
                          <div className="search-date-box">
                            <div className="search-date-container">
                              <div className="nd_options_height_10" />
                              <h3>{t('search.select_date')}:</h3>
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
                                <h3>{t('search.max_price')}:</h3>
                                <p><span>{this.state.price.toLocaleString()}</span> VND</p>
                              </div>
                              <div className="nd_travel_section mt-50">
                                <Slider
                                  min={0}
                                  max={50000000}
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
                                <h3>{t('search.last_in')}:</h3>
                                <p><span>{this.state.lasting}</span> {t('search.days')}</p>
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
                                <h3>{t('search.rating')}:</h3>
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
                              <button type="submit" className="co-btn green" onClick={this.handleSubmitFilter.bind(this)}>{t('search.apply')}</button>
                              <button type="button" className="co-btn green" onClick={this.handleReset.bind(this)}>{t('search.reset')}</button>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="col-sm-8 search-zone">
                          <div className="break d-sm-none d-block mb-5" />
                        <div className="search-for">
                          <h2>{t('search.search_for')}: &quot;{this.state.keywordDisplay}&quot;</h2>
                          <div className="nd_options_height_20"/>
                          <div className="title d-inline-block sort-container w-40">
                            <Select
                                instanceId="gender"
                                value={this.state.sort}
                                onChange={this.handleChangeSort.bind(this)}
                                placeholder={this.state.sort ? t(`search.${this.state.sort}`) : t(`search.sort`)}
                                options={this.sorts}
                            />
                          </div>
                          <div className="change-view">
                            <span className={this.state.isListView ? "active" : ''}>
                              <a onClick={this.onListView.bind(this)}><i className="fas fa-list"></i></a>
                            </span>
                            <span className={!this.state.isListView ? "active" : ''}>
                              <a onClick={this.offListView.bind(this)}><i className="fas fa-th-large"></i></a>
                            </span>
                          </div>
                        </div>
                        <div className="search-content">
                          {((this.state.searchResult && !this.state.searchResult.length) || (!this.state.searchResult)) &&
                            <div className="no-result">
                              <img alt="warning" src="/static/svg/icon-warning-white.svg" width="20" />
                              <h3>{t('search.no_result')}</h3>
                            </div>
                          }
                          <div className="search-list-item row no-margin">
                            {this.state.searchResult && !!this.state.searchResult.length && this.state.searchResult.map((item, key) => {
                                return(
                                  <SearchItem key={key} isGrid={!this.state.isListView} item={item} t={t} isLast={key === this.state.searchResult.length - 1}/>
                                )
                              })
                            }
                          </div>
                        </div>
                        {this.state.searchResult && !!this.state.searchResult.length && this.state.totalPage > 1 &&
                          <div className="pagination row text-center">
                            <ReactPaginate
                              previousLabel={<i className="fas fa-chevron-left"></i>}
                              nextLabel={<i className="fas fa-chevron-right"></i>}
                              previousClassName={'previous-pagination-li'}
                              nextClassName={'next-pagination-li'}
                              previousLinkClassName={'previous-pagination-a'}
                              nextLinkClassName={'next-pagination-a'}
                              disabledClassName={'disabled-navigate'}
                              breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={this.state.totalPage}
                              marginPagesDisplayed={1}
                              pageRangeDisplayed={1}
                              onPageChange={this.handlePageClick.bind(this)}
                              containerClassName={'pagination'}
                              subContainerClassName={'pages pagination'}
                              activeClassName={'active'}
                              pageClassName={'custom-pagination-li'}
                              pageLinkClassName={'custom-pagination-a'}
                              forcePage={this.state.page}/>
                          </div>
                        }
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

export default withNamespaces('translation')(SearchResult)
