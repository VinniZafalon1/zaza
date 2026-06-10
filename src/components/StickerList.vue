<template>
  <div>
    <StickerCard
      v-for="sticker in stickers"
      :key="sticker.id"
      :sticker="sticker"
      @toggle="$emit('toggle', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import StickerCard from './StickerCard.vue'

defineProps<{
  stickers: any[]
}>()

defineEmits(['toggle'])
</script>