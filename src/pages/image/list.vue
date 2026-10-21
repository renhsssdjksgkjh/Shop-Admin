<template>
    <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
        <el-header class="image-header">
            <el-button type="primary" @click="handleOpenCreate">新增图片分类</el-button>
            <el-button type="warning" @click="handleOpenUpload">新增图片</el-button>
        </el-header>
        <el-container>
            <image-aside ref="ImageAsideRef" @change="handleAsideChange"></image-aside>
            <image-main ref="ImageMainRef"></image-main>
        </el-container>
    </el-container>
</template>
<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'

const ImageMainRef = ref(null)
const ImageAsideRef = ref(null)
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40

const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const handleAsideChange = (Image_class_id) => {
    ImageMainRef.value.loadData(Image_class_id)
}

const handleOpenUpload=()=>ImageMainRef.value.openUploadFile()
</script>
<style scoped>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>