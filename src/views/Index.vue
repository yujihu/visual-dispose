<script lang="ts" setup>
import { ref, computed } from 'vue'
import throttle from 'lodash-es/throttle'
import Draggable from 'vuedraggable'
import Banner from '../components/View/Banner.vue'
import Product from '../components/View/Product.vue'
import Images from '../components/View/Images.vue'

const materials = {
  banner: {
    name: '轮播图',
    icon: 'picture',
    com: Banner
  },
  product: {
    name: '商品',
    icon: 'goods',
    com: Product
  },
  images: {
    name: '图片',
    icon: 'picture',
    com: Images
  }
}

interface IView {
  type: string,
  title?: string,
  status?: number,
  data?: Array<any>,
  options?: object,
  backgroundColor?: string
}

const views = ref<IView[]>([
  {
    type: 'info',
    title: '页面标题'
  }
])

const info = computed(() => {
  return views.value[0]
})

const dragMaterial = ref<string>()
const dragIndex = ref()
const isRight = ref(false)
const props = ref({})
let isPushed = false
function dragStart(e: DragEvent) {
  console.log('drag start')
  dragMaterial.value = (e.target as HTMLElement).dataset.material
}
function dragEnd() {
  console.log('drag end')
  delete views.value[dragIndex.value].status
  isPushed = false
  dragMaterial.value = undefined
}
function drop() {
  console.log('drop')
  if (!dragMaterial.value) {
    return
  }
  dragEnd()
}

const dragOver = throttle(function (e) {
  console.log('drag over')
  if (!dragMaterial.value) {
    return
  }
  const className = e.target.className
  const name = className !== 'view-content' ? 'item' : 'view-content'
  const defaultData: IView = {
    type: dragMaterial.value, // 组件类型
    status: 2, // 默认状态
    data: [], // 数据
    options: {} // 选项操作
  }
  if (name === 'view-content') {
    if (!isPushed) {
      dragIndex.value = views.value.length
      isPushed = true
      views.value.push(defaultData)
    }
  } else if (name === 'item') {
    const target = e.target
    let [y, h, curIndex] = [
      e.offsetY,
      target.offsetHeight,
      target.dataset.index
    ]
    const isTop = y < h / 2
    if (!isPushed) {
      // Push to Top or Bottom
      if (isTop) {
        if (curIndex === 0) {
          views.value.unshift(defaultData)
        } else {
          views.value.splice(curIndex, 0, defaultData)
        }
      } else {
        curIndex = +curIndex + 1
        views.value.splice(curIndex, 0, defaultData)
      }
    } else {
      // Moving
      let result
      if (isTop) {
        const i = curIndex === 0 ? 0 : curIndex - 1
        result = views.value[i]['status'] === 2
      } else {
        const i = +curIndex + 1
        result = views.value.length > i && views.value[i]['status'] === 2
      }

      if (result) return

      const temp = views.value.splice(dragIndex.value, 1)
      views.value.splice(curIndex, 0, temp[0])
    }
    dragIndex.value = curIndex
    isPushed = true
  }
}, 200)

function selectType(index: number) {
  console.log(index)
}
function deleteItem(index: number){
  views.value.splice(index, 1)
  isRight.value = false
  props.value = {}
}
</script>
<template>
  <div class="container">
    <div class="left">
      <ul @dragstart="dragStart" @dragend="dragEnd">
        <li
          v-for="(val, key, index) in materials"
          draggable="true"
          :data-material="key"
          :key="index + 1"
        >
          <el-icon size="40px">
            <component :is="val.icon" />
          </el-icon>
          <el-icon></el-icon>
          <p>{{ val.name }}</p>
        </li>
      </ul>
    </div>
    <div class="middle">
      <!-- header 不可拖拽 -->
      <div class="top-nav" @click="selectType(0)">
        <img src="./../assets/images/top-nav.png" />
        <span class="title">{{ info.title }}</span>
      </div>
      <div
        class="view-content"
        @drop.prevent.stop="drop"
        @dragover.prevent.stop="dragOver"
        :style="{ backgroundColor: info.backgroundColor }"
      >
        <Draggable v-model="views">
          <template #item="{ element, index }">
            <div
              v-if="index > 0"
              :data-index="index"
              :key="index"
              class="item"
              @click="selectType(index)"
            >
              <!-- waiting -->
              <template v-if="element.status && element.status === 2">
                <div class="wait">{{ element.type }}</div>
              </template>
              <template v-else>
                <component
                  :is="materials[element.type]['com']"
                  :data="element"
                ></component>
              </template>
              <el-icon>
                <circle-close-filled @click.prevent.stop="deleteItem(index)" />
              </el-icon>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background: #f7f8f9;
  height: calc(100vh - 50px);
  position: relative;

  .left,
  .right {
    width: 340px;
    height: 100%;
    padding: 15px 0;
    background: #fff;
  }

  .left {
    ul {
      margin: 0;
      padding: 0;

      li {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        cursor: default;
        list-style: none;
        font-size: 14px;
        color: #666;
        float: left;
        margin: 0 10px;
        border-radius: 6px;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          background: #efefef;
        }

        span {
          display: block;
          font-size: 40px;
          margin-bottom: 8px;
          color: #999;
        }

        p {
          display: block;
          margin: 0;
          font-size: 12px;
        }
      }
    }
  }

  .middle {
    width: auto;
    max-width: 400px;
    position: relative;

    .top-nav {
      position: absolute;
      top: 0;
      background: #fff;
      z-index: 999;
      transition: all 0.3s;

      & * {
        pointer-events: none;
      }

      &:hover {
        transform: scale(0.95);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px #afafaf;
      }

      .title {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
      }

      img {
        max-width: 100%;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
      }
    }

    .view-content {
      width: 400px;
      height: 700px;
      background: #f5f5f5;
      overflow-y: auto;
      overflow-x: hidden;
      padding-top: 72px;
      box-shadow: 0 2px 6px #ccc;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: #dbdbdb;
      }

      &::-webkit-scrollbar-track {
        background: #f6f6f6;
      }

      .item {
        transition: all 0.3s;
        background: #fff;
        position: relative;

        &:hover {
          transform: scale(0.95);
          border-radius: 10px;
          box-shadow: 0 0 10px #afafaf;

          > i {
            display: block;
          }
        }

        div {
          pointer-events: none;
        }

        .wait {
          background: #deedff;
          height: 35px;
          text-align: center;
          line-height: 35px;
          font-size: 12px;
          color: #666;
        }

        > i {
          position: absolute;
          right: -10px;
          top: -6px;
          color: red;
          cursor: pointer;
          display: none;
          z-index: 9999;
        }
      }
    }
  }
}
</style>
