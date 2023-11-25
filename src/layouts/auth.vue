<template>
  <div
    class="grid grid-rows-[auto,minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[1fr,60vw] h-full"
  >
    <AppLogo class="w-[calc(200px-1rem)] m-4 md:hidden" size="lg"></AppLogo>
    <div
      class="hidden overflow-hidden relative bg-gradient-to-br from-gray-800/20 to-purple-800/20 w-full md:flex flex-col justify-between h-full border-r-2 border-gray-800"
    >
      <div
        class="absolute inset-0 w-full h-full"
        style="animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      >
        <img
          src="@/assets/background.jpg"
          alt=""
          class="absolute z-0 filter object-cover opacity-5 inset-0 w-full h-full"
        />
      </div>
      <AppLogo class="z-10 w-[calc(200px-1rem)] m-8" size="xl"></AppLogo>
      <div class="z-10 m-8 text-gray-300 space-y-2">
        <p class="text-lg">Stuff Or Whatever</p>
        <p class="text-gray-500">made with 💚 by nicole</p>
        <p class="text-gray-500">
          Photo by
          <a
            href="https://unsplash.com/@kevinandrephotography?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            >Kevin Andre</a
          >
          on
          <a
            href="https://unsplash.com/photos/turned-off-crt-tv-nHCssXpg_Po?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            >Unsplash</a
          >
        </p>
      </div>
    </div>
    <div class="p-8 flex items-center">
      <div class="m-auto grid max-w-xl gap-8 rounded-xl text-center pb-20">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
