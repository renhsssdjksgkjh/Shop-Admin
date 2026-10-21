import { ref, reactive } from 'vue'
import { showModal, toast } from '~/composables/utils.js'
import { logout, updatepassword } from '~/api/manager.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export function useRepassword() {
    const store = useStore()
    const router = useRouter()
    const formRef = ref(null)
    const formDrawerRef = ref(null)

    const form = reactive({
        oldpassword: "",
        password: "",
        repassword: ""
    })

    const rules = {
        oldpassword:
            [{
                required: true,
                message: '旧密码不能为空！',
                trigger: 'blur'
            },
            { min: 3, max: 5, message: '长度不在3~5之间', trigger: 'blur' }]
        ,
        password: [
            {
                required: true,
                message: "新密码不能为空！",
                trigger: 'blur'
            }
        ],
        repassword: [
            {
                required: true,
                message: "确认密码不能为空！",
                trigger: 'blur'
            }
        ]
    }

    const onSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
        })
        formDrawerRef.value.showloading()
        updatepassword(form).then(res => {
            toast('修改密码成功，请重新登录！')
            store.dispatch("logout")
            router.push('/login')
        }).finally(() => {
            formDrawerRef.value.hideloading()
        })
    }
    const openRePasswordForm = () => formDrawerRef.value.open()
    return {
        formDrawerRef,
        form,
        rules,
        formRef,
        onSubmit,
        openRePasswordForm
    }
}

export function useLogout(){
    const store = useStore()
    const router = useRouter()

    function handleLogout() {
        showModal('您是否确认退出登录？').then(res => {
            logout().finally(() => {
                store.dispatch('logout')
                router.push('/login')
                toast('退出成功')
            })
        })
    }
    return {handleLogout}
}