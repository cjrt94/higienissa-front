<script setup>
const { state, answer } = useConfirm()
</script>

<template>
  <BaseModal :model-value="state.open" :title="state.title" @update:model-value="answer(false)">
    <p style="margin:0;color:#3a3f4a">{{ state.message }}</p>
    <template #footer>
      <button class="admin-btn ghost" @click="answer(false)">{{ state.cancelText }}</button>
      <button class="admin-btn" :class="{ danger: state.danger }" @click="answer(true)">{{ state.confirmText }}</button>
    </template>
  </BaseModal>
</template>
