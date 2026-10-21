<template>
    <div class="flex justify-between items-center">
        <div>
            <el-button v-if="btns.includes('create')" type="primary" size="small"
                @click="$emit('create')">新增</el-button>
            <el-popconfirm v-if="btns.includes('delete')" width="220" title="是否确定要删除该规格？" confirm-button-text="确认"
                cancel-button-text="取消" @confirm="$emit('delete')">
                <template #reference>
                    <el-button type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
            <slot></slot>
        </div>
        <div>
            <el-tooltip effect="dark" content="刷新数据" placement="top" v-if="btns.includes('refresh')">
                <el-button text size="small" @click="$emit('refresh')">
                    <el-icon :size="15">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="导出数据" placement="top" v-if="btns.includes('download')">
                <el-button text size="small" @click="$emit('download')">
                    <el-icon :size="15">
                        <Download />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

// 父子组件通信使用 defineEmits 和 defineProps
const props = defineProps({
    layout: {
        type: String,
        default: 'create,refresh'
    }
})
const btns = computed(() => props.layout.split(','))

defineEmits(['create', 'refresh', 'delete', 'download'])

</script>