<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-form-item label="物流查询key">
                <div>
                    <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
                    <small class="text-gray-500 flex mt-1">用于查询物流信息，接口申请（仅供参考）</small>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import {
    getSysconfig,
    setSysconfig,
} from '~/api/sysconfig.js'
import { ref, reactive } from 'vue'


const form=reactive({
    ship:''
})

const loading = ref(false)
function getData() {
    loading.value = true
    getSysconfig().then(res => {
        for (const k in form) {
            form[k] = res[k]
        }
    }).finally(() => loading.value = false)
}

getData()

const submit = () => {
    loading.value = true
    setSysconfig(form).then(res => {
        toast('设置成功！')
        getData()
    }).finally(() => loading.value = false)
}
</script>