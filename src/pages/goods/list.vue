<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabbars"
                :key="index"></el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class="border-0">
            <Search :model="searchForm" @reset="resetSearchForm" @search="getData">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="商品分类">
                        <el-select v-model="searchForm.category_id" placeholder="请选择商品类型" clearable>
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </SearchItem>
                </template>
            </Search>

            <ListHeader layout="refresh,create" @refresh="getData" @create="handleCreate">
                <el-button type="danger" size="small" @click="handleMultiDelete"
                    v-if="searchForm.tab != 'delete'">批量删除</el-button>

                <el-popconfirm width="220" title="是否确定恢复该商品？" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="handleRestoreGoods" v-else>
                    <template #reference>
                        <el-button type="warning" size="small">恢复商品</el-button>
                    </template>
                </el-popconfirm>

                <el-popconfirm width="220" title="是否确定永久删除该商品？" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="handleDestroyGoods" v-if="searchForm.tab == 'delete'">
                    <template #reference>
                        <el-button type="danger" size="small">彻底删除</el-button>
                    </template>
                </el-popconfirm>


                <el-button type="primary" size="small" @click="handleMultiStatusChange(1)"
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架</el-button>
                <el-button type="danger" size="small" @click="handleMultiStatusChange(0)"
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架</el-button>
            </ListHeader>

            <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
                style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image class="mr-3 rounded" :src="row.cover" fit="fill" :lazy="true"
                                style="width:50px; height:50px;"></el-image>
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">${{ row.min_price }}</span>
                                    <el-divider direction="vertical"></el-divider>
                                    <span class="text-gray-500 text-xs">${{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : "未分类" }}
                                </p>
                                <p class="text-gray-400 text-xs ">创建时间：{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际销量" width="70" prop="sale_count" align="center" />
                <el-table-column label="商品状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{ row.status ? '上架' : '仓库'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" width="120" align="center" v-if="searchForm.tab != 'delete'">
                    <template #default="{ row }">
                        <div v-if="row.ischeck == 0" class="flex flex-col">
                            <el-button type="success" size="small" plain>审核通过</el-button>
                            <el-button type="danger" class="mt-2 !ml-0" size="small" plain>审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" width="90" prop="sale_count" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <div v-if="searchForm.tab != 'delete'">
                            <el-button class="px-1" type="primary" size="small" text
                                @click="handleEdit(row)">修改</el-button>
                            <el-button class="px-1"
                                :type="(row.sku_type == 0 && !row.sku_value) || (row.sku_type == 1 && !row.goods_skus.length) ? 'danger' : 'primary'"
                                size="small" text @click="handleSetGoodsSkus(row)"
                                :loading="row.skusLoading">商品规格</el-button>
                            <el-button class="px-1" :type="row.goods_banner.length == 0 ? 'danger' : 'primary'"
                                size="small" text @click="handleSetGoodsBanners(row)"
                                :loading="row.bannersLoading">设置轮播图</el-button>
                            <el-button class="px-1" :type="row.content ? 'primary' : 'danger'" size="small" text
                                @click="handleSetGoodsContent(row)" :loading="row.contentLoading">商品详情</el-button>
                            <el-popconfirm width="220" title="是否确定要删除该商品？" confirm-button-text="确认"
                                cancel-button-text="取消" @confirm="handleDelete([row.id])">
                                <template #reference>
                                    <el-button class="px-1" type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else>暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-center align-center mt-5">
                <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
            <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
                <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <ChooseImage v-model="form.cover"></ChooseImage>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="form.category_id" placeholder="选择所属商品分类">
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="desc">
                        <el-input v-model="form.desc" placeholder="选填，商品卖点" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="form.unit" placeholder="请输入单位" style="width:50%;"></el-input>
                    </el-form-item>
                    <el-form-item label="总库存" prop="stock">
                        <el-input v-model="form.stock" type="number" style="width:50%;">
                            <template #append>
                                件
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock">
                        <el-input v-model="form.min_stock" type="number" style="width:50%;">
                            <template #append>
                                件
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低销售价" prop="min_price">
                        <el-input v-model="form.min_price" type="number" style="width:50%;">
                            <template #append>
                                元
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_oprice">
                        <el-input v-model="form.min_oprice" type="number" style="width:50%;">
                            <template #append>
                                元
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :value="0">隐藏</el-radio>
                            <el-radio :value="1">显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :value="0">放入仓库</el-radio>
                            <el-radio :value="1">立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>
        <banners ref="bannersRef" @reload-data="getData"></banners>
        <content ref="contentRef" @reload-data="getData"></content>
        <skus ref="skusRef" @reload-data="getData"></skus>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { getGoodsList, updateGoodsStatus, updateGoods, deleteGoods, createGoods, restoreGoods, destroyGoods } from '~/api/goods.js'
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import ListHeader from '~/components/ListHeader.vue'
import { getCategoryList } from '~/api/category.js'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'
import banners from './banners.vue'
import content from './content.vue'
import skus from './skus.vue'
import { toast } from '~/composables/utils.js'

const {
    searchForm,
    resetSearchForm,
    getData,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    handleDelete,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    handleMultiStatusChange,
    multiSelectionIds
} = useInitTable({
    delete: deleteGoods,
    updateStatus: updateGoodsStatus,
    searchForm: {
        tab: "all",
        title: "",
        category_id: null
    },
    getList: getGoodsList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map((item) => {
            item.bannersLoading = false
            item.contentLoading = false
            item.skusLoading = false
            return item
        })
        total.value = res.totalCount
    }
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreate,
    handleEdit
} = useInitForm({
    rules: {
        username: [{
            required: true,
            message: "用户名不能为空！",
            trigger: 'blur'
        }],
        password: [{
            required: true,
            message: "密码不能为空！",
            trigger: 'blur'
        }]
    },
    form: {
        title: null,
        category_id: 0,
        cover: null,
        desc: null,
        unit: '件',
        stock: 100,
        min_stock: 10,
        status: 1,
        stock_display: 1,
        min_price: 0,
        min_oprice: 0
    },
    getData,
    update: updateGoods,
    create: createGoods,

})

const tabbars = [
    {
        key: 'all',
        name: '全部'
    },
    {
        key: 'checking',
        name: '审核中'
    },
    {
        key: 'saling',
        name: '出售中'
    },
    {
        key: 'off',
        name: '已下架'
    },
    {
        key: 'min_stock',
        name: '库存预警'
    },
    {
        key: 'delete',
        name: '回收站'
    },
]
const category_list = ref([])

getCategoryList().then(res => category_list.value = res)


//设置轮播图
const bannersRef = ref(null)
const handleSetGoodsBanners = (row) => bannersRef.value.open(row)

//设置商品详情
const contentRef = ref(null)
const handleSetGoodsContent = (row) => contentRef.value.open(row)

//设置商品规格
const skusRef = ref(null)
const handleSetGoodsSkus = (row) => skusRef.value.open(row)

//恢复商品
const handleRestoreGoods = () => {
    useMultiAction(restoreGoods, '恢复')
}

//彻底删除
const handleDestroyGoods = () => {
    useMultiAction(destroyGoods, '彻底删除')
}

//彻底删除和彻底恢复相似代码封装
function useMultiAction(func, msg) {
    loading.value = true
    func(multiSelectionIds.value).then(res => {
        toast(msg + '成功！')
        if (multipleTableRef.value) {
            multipleTableRef.value.clearSelection()
        }
        getData()
    }).finally(() => {
        loading.value = false
    })
}
</script>
