<template>

</template>

<script lang="ts" setup>
const props = defineProps({
    beautifulFeature: Array<{
        content: string;
        status: Ref<T>;
    }>,
    labFeature: Array<{
        content: string;
        status: Ref<T>;
    }>,
    dangerousFeature: Array<{ content: string, func: () => void }>
})

// var script = document.createElement("script");
// script.type = "text/javascript";
// script.src = "//unpkg.com/mathlive@0.90.10/dist/mathlive.js";
// document.body.appendChild(script);

</script>