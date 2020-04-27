<template>
  <index-layout>
    <slot></slot>
  </index-layout>
</template>

<script>
import IndexLayout from './layouts/default';

export default {
  components: {
    IndexLayout,
  }
}
</script>