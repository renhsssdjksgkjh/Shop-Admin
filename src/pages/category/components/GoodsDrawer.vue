<template>
    <FormDrawer ref="formDrawerRef" title="推荐商品" @submit="handleConnect" confirmText="关联">
        <el-table :data="tableData" border stripe style="width:100%">
            <el-table-column prop="goods_id" label="ID" width="60" />
            <el-table-column label="商品封面" width="180">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="fill" :lazy="true" style="width:64px; height:64px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-popconfirm width="220" title="是否确定要删除该产品？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button type="primary" text size="small" :loading="row.loading">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </FormDrawer>
    <ChooseGoods ref="ChooseGoodsRef"></ChooseGoods>
</template>

<script setup>
import FormDrawer from '~/components/FormDrawer.vue'
import { ref } from 'vue'
import {
    getCategoryGoods,
    deleteCategoryGoods,
    connectCategoryGoods
} from '~/api/category.js'
import { toast } from '~/composables/utils.js'
import ChooseGoods from '~/components/ChooseGoods.vue'

const ChooseGoodsRef = ref(null)
const formDrawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])
const open = (data) => {
    category_id.value = data.id
    data.goodsDrawerLoading = true
    getData().then(res => formDrawerRef.value.open()).finally(() => data.goodsDrawerLoading = false)
}

function getData() {
    return getCategoryGoods(category_id.value).then(res => {
        tableData.value = res.map(o => {
            o.loading = false
            return o
        })
    })
}

const handleDelete = (row) => {
    row.loading = true
    deleteCategoryGoods(row.id).then(res => {
        toast('删除产品成功！')
        getData()
    })
}

const handleConnect = () => {
    ChooseGoodsRef.value.open((goods_ids) => {
        formDrawerRef.value.showloading()
        connectCategoryGoods({
            category_id: category_id.value,
            goods_ids
        }).then(res => {
            getData()
            toast('关联成功！')
        }).finally(() => {
            formDrawerRef.value.hideloading()
        })
    })
}

defineExpose({
    open
})
</script>