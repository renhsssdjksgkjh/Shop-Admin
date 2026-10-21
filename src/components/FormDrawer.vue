<template>
    <el-drawer v-model="showDrawer" :title=title :size=size :close-on-click-modal="false"
        :destroy-on-close="destroyOnClose">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>

</template>
<script setup>
import { ref } from 'vue'
const showDrawer = ref(false)
const props = defineProps({
    title: String,
    size: {
        type: String,
        default: '45%'
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "提交"
    }
})
const loading = ref(false)
const showloading = () => loading.value = true
const hideloading = () => loading.value = false

const emit = defineEmits(['submit'])
const submit = () => emit('submit')
const open = () => showDrawer.value = true
const close = () => showDrawer.value = false
defineExpose({
    open, close, showloading, hideloading
})
</script>
<style>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply mt-auto flex items-center;
}
</style>