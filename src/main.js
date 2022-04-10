import { createApp } from 'vue'
import App from './App.vue'
import * as ElIcons from '@element-plus/icons-vue'

const app = createApp(App)
for (const name in ElIcons) {
  app.component(name, ElIcons[name])
}
app.mount('#app')
