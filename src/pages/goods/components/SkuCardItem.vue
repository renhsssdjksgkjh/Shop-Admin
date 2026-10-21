<template>
    <div v-loading="loading" >
        <el-tag class="mx-1" v-for="(tag, index) in item.goodsSkusCardValue" :key="index" closable
            :disable-transitions="false" @close="handleClose(tag)" effect="plain">
            <el-input class="w-20 ml-[-10px]" v-model="tag.text" placeholder="选项值" size="small" clearable @change="handleChange($event,tag)"></el-input>
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加选项值
        </el-button>
    </div>
</template>

<script setup>
import {
    initSkusCardItem
} from '~/composables/useSku.js'

const props = defineProps({
    skuCardId: [Number, String]
})

const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange
} = initSkusCardItem(props.skuCardId)

</script>