<template>
  <div id="main-nuxt-loading" aria-live="polite" role="status"><div>Loading...</div></div>
</template>


<style lang="less" scoped>
#main-nuxt-loading {
  // visibility: hidden;
  // opacity: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: mainNuxtLoadingIn 10s ease;
  -webkit-animation: mainnuxtloadingin 10s ease;
  animation-fill-mode: forwards;
  overflow: hidden;
}

@keyframes mainNuxtLoadingIn {
  0% {
    visibility: hidden;
    opacity: 0;
  }

  20% {
    visibility: visible;
    opacity: 0;
  }

  100% {
    visibility: visible;
    opacity: 1;
  }
}

@-webkit-keyframes mainNuxtLoadingIn {
  0% {
    visibility: hidden;
    opacity: 0;
  }

  20% {
    visibility: visible;
    opacity: 0;
  }

  100% {
    visibility: visible;
    opacity: 1;
  }
}

#main-nuxt-loading > div,
#main-nuxt-loading > div::after {
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
}

#main-nuxt-loading > div {
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border: 0.5rem solid #f5f5f5;
  border-left: 0.5rem solid #5d81f9;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: mainnuxtloading 1.1s infinite linear;
  animation: mainNuxtLoading 1.1s infinite linear;
}

#main-nuxt-loading.error > div {
  border-left: 0.5rem solid #ff4500;
  animation-duration: 5s;
}

@-webkit-keyframes mainNuxtLoading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes mainNuxtLoading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
