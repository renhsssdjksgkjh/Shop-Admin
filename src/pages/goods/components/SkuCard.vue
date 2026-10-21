<template>
    <el-form-item label="规格选项" v-loading="bodyLoading">
        <el-card shadow="never" class="mb-3 w-full" v-for="(item, index) in sku_card_list" :key="item.id"
            v-loading="item.loading">
            <template #header>
                <div class="flex items-center">
                    <el-input v-model="item.text" placeholder="规格名称" style="width:200px" @change="handleUpdate(item)">
                        <template #append><el-icon @click="handleChooseSku(item)" class="cursor-pointer">
                                <More />
                            </el-icon></template>
                    </el-input>
                    <el-button type="primary" size="small" class="ml-auto" @click="sortCard('up', index)"
                        :disabled="index == 0"><el-icon>
                            <Top />
                        </el-icon></el-button>
                    <el-button type="primary" size="small" @click="sortCard('down', index)"
                        :disabled="index == (sku_card_list.length - 1)"><el-icon>
                            <Bottom />
                        </el-icon></el-button>
                    <el-popconfirm width="220" title="是否确定要删除该选项？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(item)">
                        <template #reference>
                            <el-button type="primary" size="small"><el-icon>
                                    <Delete />
                                </el-icon></el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </template>
            <SkuCardItem :skuCardId="item.id"></SkuCardItem>
        </el-card>
        <el-button type="success" size="small" :loading="btnLoading" @click="addSkusCardEvent">添加规格</el-button>
    </el-form-item>
    <ChooseSku ref="ChooseSkuRef"></ChooseSku>
</template>

<script setup>
import SkuCardItem from './SkuCardItem.vue'
import {
    sku_card_list,
    btnLoading,
    addSkusCardEvent,
    handleUpdate,
    handleDelete,
    sortCard,
    bodyLoading,
    handleChooseSetGoodsSkusCard
} from '~/composables/useSku.js'
import ChooseSku from '~/components/ChooseSku.vue'
import { ref } from 'vue'


const ChooseSkuRef = ref(null)

const handleChooseSku = (item) => {
    ChooseSkuRef.value.open((value) => {
        handleChooseSetGoodsSkusCard(item.id, {
            name: value.name,
            value: value.list
        })
    })
}

</script>

<style>
.el-card__header {
    @apply !p-2 bg-gray-50;
}
</style>