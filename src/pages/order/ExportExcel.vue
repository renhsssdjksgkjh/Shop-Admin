<template>
    <el-drawer title="导出订单" v-model="dialogVisible" size="40%">
        <el-form :model="form" label-width="80px">
            <el-form-item label="订单类型">
                <el-select v-model="form.tab" placeholder="请选择">
                    <el-option v-for="item in tabs" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="YYYY-MMMM-DD" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
    exportOrder
} from '~/api/order'
import { toast } from '~/composables/utils.js'

defineProps({
    tabs: Array
})

const form = reactive({
    tab: null,
    time: ''
})

const loading = ref(false)
const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true
}

const close = () => dialogVisible.value = false

const onSubmit = () => {
    loading.value = true
    let starttime = null
    let endtime = null
    if (!form.tab) return toast('订单类型不能为空！', 'error')
    if (form.time && Array.isArray(form.time)) {
        [starttime, endtime] = form.time
    }
    exportOrder({
        tab: form.tab,
        starttime,
        endtime
    }).then(data => {
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        document.body.appendChild(link)
        link.style.display = 'none'
        link.href = url
        let filename = (new Date()).getTime() + '.xlsx'
        link.setAttribute('download', filename)
        link.click()
        close
    }).finally(() => loading.value = false)
}

defineExpose({
    open
})
</script>