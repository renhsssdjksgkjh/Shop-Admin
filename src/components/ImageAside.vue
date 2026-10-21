<template>
    <el-aside width="200px" class="image-aside" v-loading="loading">
        <div class="top">
            <aside-list @click="handleChangeActiveId(item.id)" @edit="handleEdit(item)" @delete="handledelete(item.id)" v-for="(item, index) in list"
                :key="index" :active="activeId == item.id">{{ item.name
                }}</aside-list>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev,next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>
    </el-aside>

    <form-drawer ref="formDrawerRef" @submit="handleSubmit" :title="drawerTitle">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000" />
            </el-form-item>
        </el-form>

    </form-drawer>

</template>
<script setup>
import { toast } from '~/composables/utils.js'
import FormDrawer from './FormDrawer.vue'
import AsideList from '~/components/AsideList.vue'
import { getImageClassList, CreateImageClass, UpdateImageClass, DeleteImageClass } from '~/api/Image_class.js'
import { reactive, ref, computed } from 'vue'

const loading = ref(false)
const list = ref([])
const formDrawerRef = ref(null)
const formRef = ref(null)
const editid = ref(0)
const drawerTitle = computed(() => editid.value ? '修改' : '新增')

const form = reactive({
    name: '',
    order: 50
})

const rules = {
    name: [{
        required: true,
        message: '图库分类名称不能为空！',
        trigger: 'blur'
    }]
}

const handleSubmit = () => {
    formDrawerRef.value.showloading()
    formRef.value.validate((valid) => {
        if (!valid) return

        const fun = editid.value ? UpdateImageClass(editid.value, form) : CreateImageClass(form)

        fun.then(res => {
            toast(drawerTitle.value + '成功')
            getData(editid.value ? currentPage.value : 1)
            formDrawerRef.value.close()
        })
    }).finally(() => formDrawerRef.value.hideloading())
}

const limit = ref(10)
const currentPage = ref(1)
const total = ref(0)

const handleCreate = () => {
    editid.value = 0
    form.name = ''
    form.order = 50
    formDrawerRef.value.open()
}

const handleEdit = (row) => {
    editid.value = row.id
    form.name = row.name
    form.order = row.order
    formDrawerRef.value.open()
}

const handledelete = (id) => {
    DeleteImageClass(id).then(res => {
        toast('删除成功！')
        getData(currentPage.value)
    })
}

function getData(p=null) {
    if (typeof p == 'number') {
        currentPage.value = p
    }
    loading.value = true
    getImageClassList(currentPage.value).then(res => {
        total.value = res.totalCount
        list.value = res.list
        let item = list.value[0]
        if (item) {
            handleChangeActiveId(item.id)
        }
    }).finally(() => loading.value = false)
}
getData()


const emit=defineEmits(['change'])
const activeId = ref(0)
const handleChangeActiveId=(id)=>{
    activeId.value=id
    emit('change',activeId.value)
}

defineExpose({
    handleCreate
})

</script>
<style>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow: auto;
}

.image-aside .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    right: 0;
    @apply flex items-center justify-center;
}
</style>