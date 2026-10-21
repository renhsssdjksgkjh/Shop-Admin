<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <el-row :gutter="20">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding': 0 }"
                        :class="{ 'border-blue-500': item.checked }">
                        <el-image :src="item.url" fit="cover" class="h-[150px]" style="width: 100%;"
                            :preview-src-list="[item.url]" :initial-index="0"></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex items-center justify-between">
                            <el-checkbox v-if="openChoose" v-model="item.checked" class="ml-5"
                                @change="handleChooseChange(item)"></el-checkbox>
                            <div class="ml-auto">
                                <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>
                                <el-popconfirm width="220" title="是否确定要删除该图片？" confirm-button-text="确认"
                                    cancel-button-text="取消" @confirm="handleDelete(item.id)">
                                    <template #reference>
                                        <el-button type="primary" size="small" text>删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>
                    </el-card>

                </el-col>
            </el-row>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-main>

    <el-drawer v-model="drawer" title="上传图片">
        <up-load-file :data="{ image_class_id }" @success="handleUploadSuccess"></up-load-file>
    </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getImageList, updateImage, deleteImage } from '~/api/image.js'
import { showPrompt, toast } from '~/composables/utils'
import UpLoadFile from '~/components/UpLoadFile.vue'

const limit = ref(10)
const currentPage = ref(1)
const total = ref(0)
const list = ref([])
const loading = ref(false)
const image_class_id = ref(0)

const checkedImage = computed(() => list.value.filter(o => o.checked))

const props = defineProps({
    openChoose: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['choose'])
const handleChooseChange = (item) => {
    // 计算属性，ref均需要使用value
    if (item.checked && checkedImage.value.length > props.limit) {
        item.checked = false
        return toast(`最多只能选中${props.limit}张图片！`, 'error')
    }
    emit('choose', checkedImage.value)
}


const getData = (p = null) => {
    if (typeof p == 'number') {
        currentPage.value = p
    }
    loading.value = true
    getImageList(image_class_id.value, currentPage.value).then(res => {
        total.value = res.totalCount
        list.value = res.list.map((o) => {
            o.checked = false
            return o
        })
    }).finally(() => loading.value = false)
}

const handleEdit = (item) => {
    showPrompt('重命名', item.name).then(({ value }) => {
        loading.value = true
        updateImage(item.id, value).then(res => {
            toast('修改成功！')
            getData()
        })
    }).finally(() => loading.value = false)
}

//根据分类ID渲染数据

const loadData = (id) => {
    currentPage.value = 1
    image_class_id.value = id
    getData()
}

const handleDelete = (id) => {
    loading.value = true
    deleteImage([id]).then(res => {
        toast('删除成功！')
        getData()
    }).finally(() => loading.value = false)
}

const drawer = ref(false)
const openUploadFile = () => drawer.value = true

const handleUploadSuccess = () => getData(1)

defineExpose({
    loadData,
    openUploadFile
})
</script>
<style>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow: auto;
}

.image-main .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    right: 0;
    @apply flex items-center justify-center;
}

.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>