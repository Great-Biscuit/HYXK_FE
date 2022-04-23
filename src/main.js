import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style/iconfont.css'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
import hljs from 'highlight.js'

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
VMdEditor.use(createEmojiPlugin());

const app = createApp(App)
app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(VMdEditor)
app.mount('#app')
