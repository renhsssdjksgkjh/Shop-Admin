<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">订单统计</span>
                <div>
                    <el-check-tag v-for="(item, index) in options" :key="index" style="margin-right: 8px;"
                        :checked="item.value == current" @click="handleChoose(item.value)">{{ item.text
                        }}</el-check-tag>
                </div>
            </div>
        </template>
        <div ref="el" id="chart" style="width: 100%;height: 300px;"></div>
    </el-card>
</template>
<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getstatistics3 } from '~/api/index.js';
import { useResizeObserver } from '@vueuse/core'

var myChart = null

const current = ref("week")
const options = [
    {
        text: "近一个月",
        value: "month"
    },
    {
        text: "近一周",
        value: "week"
    },
    {
        text: "近24小时",
        value: "hour"
    }
]


const handleChoose = (type) => {
    current.value = type
    getData()
}

onMounted(() => {
    var chartDom = document.getElementById('chart');
    if (chartDom) {
        myChart = echarts.init(chartDom);
        getData()
    }
})

function getData() {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar'
            }
        ]
    }
    myChart.showLoading()
    getstatistics3(current.value).then(res => {
        option.xAxis.data = res.x
        option.series[0].data = res.y

        myChart.setOption(option)
    }).finally(() => {
        myChart.hideLoading()
    })
}

const el = ref(null)
useResizeObserver(el, () => myChart.resize())

onBeforeUnmount(() => {
    if (myChart) echarts.dispose(myChart)
})

</script>