<template>
    <div>
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <el-col :span="6" v-for="i in 4" :key="i" v-if="panels.length == 0">
                <el-skeleton style="width:100%" animated loading>
                    <template #template>
                        <el-card shadow="hover" class="border-0">
                            <template #header>
                                <div class="flex justify-between">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </template>
                            <el-skeleton-item variant="text" style="width: 80%" />
                            <el-divider />
                            <div class="flex justify-between text-sm text-gray-500">
                                <el-skeleton-item variant="text" style="width: 50%" />
                                <el-skeleton-item variant="text" style="width: 10%" />
                            </div>
                        </el-card>
                    </template>
                </el-skeleton>
            </el-col>
            <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class="flex justify-between">
                            <span class="text-sm">{{ item.title }}</span>
                            <el-tag type="success" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>
                    </template>
                    <span class="text-3xl font-bold text-gray-500">
                        <CountTo :value="item.value"></CountTo>
                    </span>
                    <el-divider />
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <index-nav></index-nav>
        <el-row :gutter="20" class="mt-5">
            <el-col :span="12" :offset="0">
                <indexChart v-permission="['getStatistics3,GET']"></indexChart>
            </el-col>
            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <indexCard title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" class="mb-3"></indexCard>
                <indexCard title="交易提示" tip="需要立即处理的交易订单" :btns="order"></indexCard>
            </el-col>
        </el-row>

    </div>
</template>
<script setup>
import indexChart from '~/components/IndexChart.vue'
import { getstatistics, getstatistics2 } from '~/api/index.js'
import { ref } from 'vue'
import CountTo from '~/components/CountTo.vue'
import indexNav from '~/components/indexNav.vue'
import indexCard from '~/components/indexCard.vue'

const goods = ref([])
const order = ref([])

const panels = ref([])
getstatistics().then(res => {
    panels.value = res.panels
})

getstatistics2().then(res => {
    goods.value = res.goods
    order.value = res.order
})
</script>