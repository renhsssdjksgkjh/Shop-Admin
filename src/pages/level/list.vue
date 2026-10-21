<template>
    <el-card shadow="never" class="border-0">

        <ListHeader @refresh="getData" @create="handleCreate"></ListHeader>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="会员等级" />
            <el-table-column prop="discount" label="折扣率" align="center" />
            <el-table-column prop="level" label="等级序号" align="center" />
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch :disabled="row.super == 1" :loading="row.statusLoading" :modelValue="row.status"
                        :active-value="1" :inactive-value="0" @change="handleStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm width="220" title="是否确定要删除该等级？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-center align-center mt-5">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name" placeholderr="等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input v-model="form.level" type="number" placeholder="等级权重"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div>
                        <small class="text-xs mr-2">累计消费满</small>
                        <el-input v-model="form.max_price" type="number" placeholder="累计消费" style="width:50%">
                            <template #append>元 </template>
                        </el-input>
                        <small class="text-gray-500 flex">
                            设置会员等级所需要的累计消费必须大于等于0，单位：元
                        </small>
                    </div>
                    <div>
                        <small class="text-xs mr-2">累计次数满</small>
                        <el-input v-model="form.max_times" type="number" placeholder="累计次数" style="width:50%">
                            <template #append>笔 </template>
                        </el-input>
                        <small class="text-gray-500 flex">
                            设置会员等级所需要的累计消费必须大于等于0，单位：笔
                        </small>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)" prop="discount">
                    <el-input v-model="form.discount" type="number" placeholder="折扣率(%)" style="width:50%">
                        <template #append>% </template>
                    </el-input>
                    <small class="text-gray-500 flex">
                        折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买！
                    </small>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { getUserLevelList, createUserLevel, updateUserLevel, deleteUserLevel, updateUserLevelStatus } from '~/api/level.js'
import FormDrawer from '~/components/FormDrawer.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import ListHeader from '~/components/ListHeader.vue'

const {
    getData,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getUserLevelList,
    delete: deleteUserLevel,
    updateStatus: updateUserLevelStatus
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreate,
    handleEdit
} = useInitForm({
    rules: {
        name: [{
            required: true,
            message: '等级名称不能为空！',
            trigger: 'blur'
        }]
    },
    form: {
        name: '',
        level: 100,
        status: 1,
        discount: 0,
        max_price: 0,
        max_times: 0
    },
    getData,
    update: updateUserLevel,
    create: createUserLevel
})

</script>