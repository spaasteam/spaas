<template>
  <div :class="{ focus: isFocus }" class="dr-input">
    <span :class="{ focus: isFocus }" class="dr-input__label">{{ label }}</span>
    <el-input
      v-model="val"
      v-bind="$attrs"
      class="dr-input__inner"
      v-on="$listeners"
      @focus="handleFocus"
      @blur="handleBlur"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "DrInput",
  props: {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      val: this.value,
      isFocus: false,
    };
  },
  methods: {
    handleFocus() {
      this.isFocus = true;
    },
    handleBlur() {
      this.isFocus = !!this.val;
    },
  },
};
</script>

<style lang="less">
.dr-input {
  input.el-input__inner {
    border: none;
    border-bottom: 2px solid #cee0ff;
    border-radius: 0;
    padding: 0;
    background-color: rgba(#fff, 0);
  }
}

.el-form-item.is-error {
  .dr-input {
    input.el-input__inner {
      border-color: #f9566b;
    }

    &::after {
      background-color: #f9566b;
    }
  }
}
</style>

<style lang="less" scoped>
.dr-input {
  height: 56px;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 0%;
    height: 2px;
    background-color: #2878ff;
    position: absolute;
    bottom: 0;
    transition: all 0.4s;
  }

  &.focus {
    &::after {
      width: 100%;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  &__label {
    font-size: 14px;
    color: #9ca6c7;
    font-weight: 400;
    line-height: 34px;
    position: absolute;
    left: 0;
    bottom: 0;
    transition: all 0.4s;

    &.focus {
      bottom: 28px;
      font-size: 12px;
      line-height: 26px;
    }
  }

  &__inner {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
