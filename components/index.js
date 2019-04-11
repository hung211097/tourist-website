import dynamic from 'next/dynamic'
const defaultLoading = {
    loading: () => ''
}

const defaultNoSSR = {
    ssr: false,
    loading: () => ''
}

import Layout from './layout'
import LayoutProfile from './layout-profile'
import Header from './header'
import Footer from './footer'
import ClickOutside from './click-outside'
import PopupInfo from './popup-info'
import PopupLoading from './popup-loading'
import PopupCancelTour from './popup-cancel-tour'
import AutoHide from './auto-hide'
import BtnViewMore from './btn-view-more/index'
import WizardStep from './wizard-step'
import Modal from './modal/index'
import CommentsFacebook from './comment-facebook'

const MyMap = dynamic(import('./mymap'), defaultLoading)
const MapComponent = dynamic(import('./map-component'), defaultLoading)
const TourItem = dynamic(import('./tour-item'), defaultLoading)
const RatingStar = dynamic(import('./rating-star'), defaultLoading)
const MapContact = dynamic(import('./map-contact'), defaultLoading)
const SlickItem = dynamic(import('./slick-item'), defaultLoading)
const Lightbox = dynamic(import('./lightbox'), defaultLoading)
const SearchItem = dynamic(import('./search-item'), defaultLoading)
const NewsItem = dynamic(import('./news-item'), defaultLoading)
const Breadcrumb = dynamic(import('./breadcrumb'), defaultLoading)

const MarkerComponent = dynamic(import('./marker'), defaultNoSSR)
const TopPromotionItem = dynamic(import('./top-promotion-item'), defaultNoSSR)
const CustomCheckbox = dynamic(import('./custom-checkbox'), defaultNoSSR)
const PassengerInfo = dynamic(import('./passenger-info'), defaultNoSSR)

export {
    Header,
    Footer,
    Layout,
    ClickOutside,
    MyMap,
    MapComponent,
    MarkerComponent,
    TopPromotionItem,
    PopupInfo,
    LayoutProfile,
    AutoHide,
    CustomCheckbox,
    TourItem,
    RatingStar,
    BtnViewMore,
    MapContact,
    SlickItem,
    Lightbox,
    WizardStep,
    PassengerInfo,
    Modal,
    SearchItem,
    PopupLoading,
    PopupCancelTour,
    NewsItem,
    Breadcrumb,
    CommentsFacebook
}
