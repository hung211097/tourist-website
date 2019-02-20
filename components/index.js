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

// import ClickOutside from './click-outside'
// import Modal from './modal/index'

export {
    Header,
    Layout
}
