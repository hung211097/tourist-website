import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'
import PropTypes from 'prop-types'
import { withNamespaces } from "react-i18next"

class TermsCondition extends React.Component {
  displayName = 'Terms Condition'

  static propTypes = {
      t: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const {t} = this.props
    return (
      <>
        <Layout page="terms-condition" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('terms.title')}</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <div className="content">
                <div className="row about">
                  <div className="col-sm-8">
                    <p>
                      {t('terms.sub_title')}
                    </p>
                    <br/>
                    <strong>{t('terms.part_1')}</strong>
                    <ul>
                      <li>
                        {t('terms.sub_part_1_1')}
                      </li>
                      <li>
                        {t('terms.sub_part_1_2')}
                      </li>
                      <li>
                         {t('terms.sub_part_1_3')}
                      </li>
                      <li>
                        {t('terms.sub_part_1_4')}
                      </li>
                    </ul>
                    <br/>
                    <strong>{t('terms.part_2')}</strong>
                    <ul>
                      <li>
                        {t('terms.sub_part_2_1')}
                      </li>
                      <li>
                        {t('terms.sub_part_2_2')}
                      </li>
                      <li>
                        {t('terms.sub_part_2_3')}
                      </li>
                      <li>
                        {t('terms.sub_part_2_4')}
                      </li>
                    </ul>
                    <strong className="mb-3 d-block mt-5">{t('terms.part_3')}</strong>
                    <p>{t('terms.sub_part_3_1')}</p>
                    <ul>
                      <li>
                        {t('terms.sub_part_3_1_1')}
                      </li>
                      <li>
                        {t('terms.sub_part_3_1_2')}
                      </li>
                      <li>
                        {t('terms.sub_part_3_1_3')}
                      </li>
                    </ul>
                    <br/>
                    <p>{t('terms.sub_part_3_2')}</p>
                    <ul>
                        <li>
                          {t('terms.sub_part_3_2_1')}
                        </li>
                        <li>
                          {t('terms.sub_part_3_2_2')}
                        </li>
                        <li>
                          {t('terms.sub_part_3_2_3')}
                        </li>
                        <li>
                          {t('terms.sub_part_3_2_4')}
                          <ul>
                            <li>
                              {t('terms.sub_part_3_2_4_1')}
                            </li>
                            <li>
                              {t('terms.sub_part_3_2_4_2')}
                            </li>
                          </ul>
                        </li>
                      </ul>
                    <br/>
                    <p>{t('terms.sub_part_3_3')}</p>
                    <ul>
                      <li>
                        {t('terms.sub_part_3_3_1')}
                      </li>
                      <li>
                        {t('terms.sub_part_3_3_2')}
                        <ul>
                          <li>
                            {t('terms.sub_part_3_3_2_1')}
                          </li>
                          <li>
                             {t('terms.sub_part_3_3_2_2')}
                          </li>
                          <li>
                            {t('terms.sub_part_3_3_2_3')}
                          </li>
                          <li>
                            {t('terms.sub_part_3_3_2_4')}
                          </li>
                          <li>
                            {t('terms.sub_part_3_3_2_5')}
                          </li>
                        </ul>
                      </li>
                      <li>
                        {t('terms.sub_part_3_3_3')}
                      </li>
                    </ul>
                    <br/>
                    <p>{t('terms.sub_part_3_4')}</p>
                    <ul>
                      <li>
                        {t('terms.sub_part_3_4_1')}
                      </li>
                      <li>
                        {t('terms.sub_part_3_4_2')}
                      </li>
                    </ul>
                    <br/>
                  </div>
                  <div className="col-sm-4">
                    <div className="gallery">
                      <div className="row">
                        <div className="col-12">
                          <div className="box-img no-margin responsive">
                            <img alt="featured_img" src="/static/images/sqb-4.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>{t('terms.city_tour')}</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>{t('terms.culture')}</p></h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="box-img">
                            <img alt="featured_img" src="/static/images/sqb-5.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>{t('terms.honeymoon')}</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>{t('terms.luxury')}</p></h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="box-img">
                            <img alt="featured_img" src="/static/images/sqb-6.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>{t('terms.adventure')}</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>{t('terms.cool')}</p></h6>
                              </div>
                            </div>
                          </div>
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

export default withNamespaces('translation')(TermsCondition)
