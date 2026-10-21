<template>
    <el-upload drag :action="uploadImageAction" multiple :headers="{ token }" name="img" :data="data"
        :on-success="uploadSuccess" :on-error="uploadError">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            拖拽文件到这里或<em>点击上传</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                jpg/png 文件大小不能超过500kb
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import { uploadImageAction } from '~/api/image.js';
import { getToken } from '~/composables/auth.js'
import { toast } from '~/composables/utils.js'

const token = getToken()
defineProps({
    data: Object
})
const emit = defineEmits(['success'])
const uploadSuccess = (response, uploadFile, uploadFiles) => {
    emit('success', response, uploadFile, uploadFiles)
}

const uploadError = (error, uploadFile, uploadFiles) => {
    let msg = JSON.parse(error.message).msg || '上传失败！！'
    toast(msg, 'error')
}
</script>