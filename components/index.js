import dynamic from 'next/dynamic'
const defaultLoading = {
    loading: () => ''
}

const defaultNoSSR = {
    ssr: false,
    loading: () => ''
}

import Layout from './layout'
import Header from './header'
import Footer from './footer'
import ClickOutside from './click-outside'
// import Modal from './modal/index'

const MyMap = dynamic(import('./mymap'), defaultLoading)
const MapComponent = dynamic(import('./map-component'), defaultLoading)

const MarkerComponent = dynamic(import('./marker'), defaultNoSSR)

export {
    Header,
    Footer,
    Layout,
    ClickOutside,
    MyMap,
    MapComponent,
    MarkerComponent
}
