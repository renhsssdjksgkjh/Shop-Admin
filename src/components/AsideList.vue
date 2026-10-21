<template>
    <div class="aside-list" :class="{ 'active': active }">
        <span class="truncate">
            <slot></slot>
        </span>
        <el-button type="primary" size="small" text class="ml-auto p-1" @click.stop="$emit('edit')">
            <el-icon>
                <Edit />
            </el-icon>
        </el-button>
        <span @click.stop="()=>{}">
            <el-popconfirm width="220" title="是否确定要删除该分类？" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="$emit('delete')">
                <template #reference>
                    <el-button type="primary" size="small" text class="p-1">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </span>
    </div>
</template>
<script setup>

defineProps({
    active: {
        type: Boolean,
        default: false
    }
})

defineEmits(['edit', 'delete'])
</script>
<style>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
    @apply bg-blue-50;
}
</style>