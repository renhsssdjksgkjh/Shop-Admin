<template>
    <div v-if="modelValue && preview" @click="open">
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"
            class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        <div v-else class="flex flex-wrap">
            <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url, index) in modelValue" :key="index">
                <el-icon class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded" style="z-index:10;"
                    @click.stop="removeImage(url)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>
    </div>
    <div class="choose-image-btn" @click="open" v-if="preview">
        <el-icon :size="25" class="text-gray-500">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="图片选择" v-model="dialogVisible" width="80%">
        <el-container class="bg-white rounded" style="height:70vh;">
            <el-header class="image-header">
                <el-button type="primary" @click="handleOpenCreate">新增图片分类</el-button>
                <el-button type="warning" @click="handleOpenUpload">新增图片</el-button>
            </el-header>
            <el-container>
                <image-aside ref="ImageAsideRef" @change="handleAsideChange"></image-aside>
                <image-main :limit="limit" openChoose ref="ImageMainRef" @choose="handleChoose"></image-main>
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import ImageAside from '~/components/ImageAside.vue'
import ImageMain from '~/components/ImageMain.vue'
import { toast } from '~/composables/utils.js'

const ImageMainRef = ref(null)
const ImageAsideRef = ref(null)
const dialogVisible = ref(null)


const callbackFunction = ref(null)
const open = (callback = null) => {
    callbackFunction.value = callback
    dialogVisible.value = true
}
const close = () => dialogVisible.value = false

const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const props = defineProps({
    modelValue: [String, Array],
    limit: {
        type: Number,
        default: 1
    },
    preview: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['update:modelValue'])
let urls = []
const handleChoose = (e) => {
    urls = e.map(o => o.url)
}


const submit = () => {
    let value = []
    if (props.limit == 1) {
        value = urls[0]
    }
    else {
        value = props.preview ? [...props.modelValue, ...urls] : [...urls]
        if (value.length > props.limit) {
            let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit
            return toast('最多还能选择' + limit + '张')
        }
    }
    if (value) {
        emit('update:modelValue', value)
    }
    if (!props.preview && typeof callbackFunction.value == 'function') {
        callbackFunction.value(value)
    }
    close()
}

const handleAsideChange = (Image_class_id) => {
    ImageMainRef.value.loadData(Image_class_id)
}

const handleOpenUpload = () => ImageMainRef.value.openUploadFile()

const removeImage = (url) => {
    emit('update:modelValue', props.modelValue.filter(u => u != url))
}

defineExpose({
    open
})
</script>
<style scoped>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}

.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>