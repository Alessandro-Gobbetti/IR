import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'

// FontAwesome setup
import {library} from "@fortawesome/fontawesome-svg-core";
import {faTwitter, faLinkedin, faSkype} from "@fortawesome/free-brands-svg-icons";
import {faVolumeHigh, faVolumeMute, faSignOut} from "@fortawesome/free-solid-svg-icons"

library.add(faLinkedin, faTwitter, faSkype, faVolumeHigh, faVolumeMute, faSignOut);
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'


createApp(App).use(store).use(router).use(VueCookies).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
