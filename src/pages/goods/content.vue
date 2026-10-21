<template>
    <FormDrawer ref="formDrawerRef" destroy-on-close title="设置商品详情" @submit="submit">
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content"></Editor>
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
import Editor from '~/components/Editor.vue'
import {
    readGoods,
    updateGoods
} from '~/api/goods.js'
import { toast } from '~/composables/utils.js'

const formDrawerRef = ref(null)

const form = reactive({
    content: '',
})

const goodsId = ref(0)
const open = (row) => {
    row.contentLoading = true
    goodsId.value = row.id
    readGoods(goodsId.value).then(res => {
        form.content = res.content
        formDrawerRef.value.open()
    }).finally(() => row.contentLoading = false)
}

const emit = defineEmits(['reloadData'])

const submit = () => {
    formDrawerRef.value.showloading()
    updateGoods(goodsId.value, form).then(res => {
        toast('设置商品详情成功！')
        formDrawerRef.value.close()
        emit('reloadData')
    }).finally(() => formDrawerRef.value.hideloading()
    )
}

defineExpose({
    open
})
</script>