<template>
  <view class="fish-badge" :class="[variantClass, sizeClass]">
    <text v-if="emoji" class="fish-badge-emoji">{{ emoji }}</text>
    <text class="fish-badge-text">{{ name }}</text>
    <text v-if="season" class="fish-badge-season">{{ season }}</text>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  emoji?: string
  season?: string
  variant?: 'open' | 'normal' | 'slow'
  size?: 'sm' | 'md'
}>(), {
  emoji: '',
  season: '',
  variant: 'normal',
  size: 'md'
})

const variantClass = computed(() => `fish-badge--${props.variant}`)
const sizeClass = computed(() => `fish-badge--${props.size}`)
</script>

<style scoped lang="scss">
.fish-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 100px;
  font-weight: 500;

  &--open {
    background: rgba(35, 165, 89, 0.1);
    color: #23A559;
  }

  &--normal {
    background: rgba(88, 101, 242, 0.1);
    color: #5865F2;
  }

  &--slow {
    background: rgba(128, 132, 142, 0.1);
    color: #80848E;
  }

  &--sm {
    font-size: 11px;
    padding: 2px 8px;
  }

  &--md {
    font-size: 12px;
    padding: 3px 10px;
  }
}

.fish-badge-emoji {
  font-size: inherit;
}

.fish-badge-text {
  font-size: inherit;
}

.fish-badge-season {
  font-size: 10px;
  opacity: 0.7;
}
</style>
