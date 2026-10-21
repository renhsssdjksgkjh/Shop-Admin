import { ref, reactive, computed } from 'vue'
import { toast } from '~/composables/utils.js'
//列表，分页，搜索，删除，修改状态，批量删除
export function useInitTable(opt = {}) {
    const limit = ref(10)
    const currentPage = ref(1)
    const total = ref(0)

    const tableData = ref([])
    const loading = ref(false)

    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
        }
    }

    function getData(p = null) {
        if (typeof p == 'number') {
            currentPage.value = p
        }
        loading.value = true
        opt.getList(currentPage.value, searchForm).then(res => {
            if (opt.onGetListSuccess && typeof opt.onGetListSuccess == 'function') {
                opt.onGetListSuccess(res)
            } else {
                tableData.value = res.list
                total.value = res.totalCount
            }
        })
            .finally(() => loading.value = false)
    }
    getData()


    const handleDelete = (id) => {
        loading.value = true
        opt.delete(id).then(res => {
            toast('删除成功！')
            getData()
        }).finally(() => loading.value = false)
    }


    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status).then(res => {
            toast('修改状态成功！')
            row.status = status
        }).finally(() => {
            row.statusLoading = false
        })
    }
    const multiSelectionIds = ref([])
    const multipleTableRef = ref(null)

    const handleSelectionChange = (e) => {
        multiSelectionIds.value = e.map(o => o.id)
    }

    //批量删除
    const handleMultiDelete = () => {
        loading.value = true
        opt.delete(multiSelectionIds.value).then(res => {
            toast('批量删除成功！')
            if (multipleTableRef.value) {
                multipleTableRef.value.clearSelection()
            }
            getData()
        }).finally(() => {
            loading.value = false
        })
    }
    //批量上架/下架
    const handleMultiStatusChange = (status) => {
        loading.value = true
        opt.updateStatus(multiSelectionIds.value, status).then(res => {
            toast(status ? '上架成功！' : '下架成功！')
            if (multipleTableRef.value) {
                multipleTableRef.value.clearSelection()
            }
            getData()
        }).finally(() => {
            loading.value = false
        })
    }

    return {
        searchForm,
        resetSearchForm,
        getData,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        handleDelete,
        handleStatusChange,
        multipleTableRef,
        handleMultiDelete,
        handleSelectionChange,
        handleMultiStatusChange,
        multiSelectionIds
    }
}

//新增，修改
export function useInitForm(opt = {}) {
    const editId = ref(0)
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const drawerTitle = computed(() => editId.value ? '修改' : '新增')
    const defaultForm = opt.form
    const form = reactive({})

    const rules = opt.rules || {}

    const handleSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) return

            formDrawerRef.value.showloading()

            let body = {}
            if (opt.beforeSubmit && typeof opt.beforeSubmit == 'function') {
                body = opt.beforeSubmit({ ...form })
            } else {
                body = form
            }

            const fun = editId.value ? opt.update(editId.value, body) : opt.create(body)

            fun.then(res => {
                toast(drawerTitle.value + '成功！')
                // 修改刷新当前页（false）
                opt.getData(editId.value ? null : 1)
                formDrawerRef.value.close()
            }).finally(() => formDrawerRef.value.hideloading())
        })
    }

    function resetForm(row = null) {
        if (formRef.value) formRef.value.clearValidate()
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }

    const handleCreate = () => {
        editId.value = 0
        resetForm(opt.form)
        formDrawerRef.value.open()
    }

    const handleEdit = (row) => {
        editId.value = row.id
        resetForm(row)
        formDrawerRef.value.open()
    }

    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        handleSubmit,
        resetForm,
        handleCreate,
        handleEdit
    }
}